import json
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv


def main():
    api_directory = Path(__file__).resolve().parents[1]
    repository = api_directory.parents[1]
    environment_file = api_directory / ".env"
    load_dotenv(environment_file if environment_file.exists() else api_directory / ".env.local")
    token = os.environ.get("API_ACCESS_TOKEN")
    if not token or not os.environ.get("DATABASE_URL"):
        raise RuntimeError("需要私有 DATABASE_URL 和 API_ACCESS_TOKEN")

    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        port = listener.getsockname()[1]
    base = f"http://127.0.0.1:{port}"
    log_path = repository / "dist/.cache/api/verify-live.log"
    log_path.parent.mkdir(parents=True, exist_ok=True)

    with log_path.open("w") as log:
        process = subprocess.Popen([
            sys.executable, "-B", "-m", "uvicorn", "app:app",
            "--host", "127.0.0.1", "--port", str(port),
        ], cwd=api_directory, stdout=log, stderr=log)
        try:
            for attempt in range(50):
                if process.poll() is not None:
                    raise RuntimeError(f"API 启动失败，日志见 {log_path}")
                try:
                    with urlopen(base + "/openapi.json", timeout=1):
                        break
                except (URLError, TimeoutError):
                    time.sleep(0.1)
            else:
                raise RuntimeError("API 启动超时")

            for label, headers, expected in (
                ("missing token", {}, 401),
                ("wrong token", {"Authorization": "Bearer invalid"}, 401),
                ("real Neon query", {"Authorization": f"Bearer {token}"}, 200),
            ):
                request = Request(base + "/hello", headers=headers)
                try:
                    response = urlopen(request, timeout=25)
                except HTTPError as error:
                    response = error
                with response:
                    status = response.status
                    payload = json.load(response)
                if status != expected:
                    raise RuntimeError(f"{label}: HTTP {status}, expected {expected}")
                if expected == 200 and payload != {"message": "hello", "database": "ok"}:
                    raise RuntimeError("数据库探针结果异常")
                print(f"PASS {label}: HTTP {status} {json.dumps(payload)}", flush=True)
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


if __name__ == "__main__":
    main()
