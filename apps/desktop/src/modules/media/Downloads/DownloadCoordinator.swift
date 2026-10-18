import Foundation

struct DownloadResult {
    let itemID: String
    let url: URL?
    let succeeded: Bool
    let errorDescription: String?
    let sidecarErrorDescription: String?
}

struct DownloadTransferResult {
    let sidecarErrorDescription: String?

    static let success = DownloadTransferResult(sidecarErrorDescription: nil)
}

struct DownloadSummary: Identifiable {
    let id = UUID()
    let successCount: Int
    let failureCount: Int
    let directory: URL?
    let title: String
    let message: String

    init(items: [MediaItem], results: [DownloadResult]) {
        let resultsByID = Dictionary(results.map { ($0.itemID, $0) }, uniquingKeysWith: { first, _ in first })
        var successfulURLs: [URL] = []
        var details: [String] = []
        for item in items {
            if let result = resultsByID[item.id], result.succeeded, let url = result.url {
                successfulURLs.append(url)
                if let warning = result.sidecarErrorDescription {
                    details.append("\(url.lastPathComponent) 附属文件：\(warning)")
                }
            } else {
                let reason = resultsByID[item.id]?.errorDescription ?? "未返回下载结果"
                details.append("\(item.name)：\(reason)")
            }
        }
        successCount = successfulURLs.count
        failureCount = items.count - successCount
        directory = successfulURLs.first?.deletingLastPathComponent()
        if successCount == 0 {
            title = "下载失败"
            message = Self.message("\(failureCount) 个文件下载失败", details: details)
        } else if failureCount > 0 {
            title = "部分下载失败"
            message = Self.message("已下载 \(successCount) 个文件，\(failureCount) 个失败", details: details)
        } else {
            title = "下载完成"
            message = Self.message("已下载 \(successCount) 个文件", details: details)
        }
    }

    private static func message(_ summary: String, details: [String]) -> String {
        guard !details.isEmpty else { return summary }
        var lines = Array(details.prefix(5))
        if details.count > 5 {
            lines.append("另有 \(details.count - 5) 项未显示")
        }
        return summary + "\n\n" + lines.joined(separator: "\n")
    }
}

final class DownloadCoordinator {
    let maxConcurrent = 2

    private let filenameResolver = FilenameResolver()
    private let stateLock = NSLock()
    private var operationQueue: OperationQueue?
    private var cancelled = false

    func cancel() {
        stateLock.lock()
        cancelled = true
        operationQueue?.cancelAllOperations()
        stateLock.unlock()
    }

    func enqueue(
        items: [MediaItem],
        destination: URL = DestinationAccess.defaultDirectory(),
        transfer: @escaping (MediaItem, URL) throws -> DownloadTransferResult
    ) -> [DownloadResult] {
        do {
            try DestinationAccess.prepare(destination)
        } catch {
            return items.map {
                DownloadResult(
                    itemID: $0.id,
                    url: nil,
                    succeeded: false,
                    errorDescription: error.localizedDescription,
                    sidecarErrorDescription: nil
                )
            }
        }

        var existingNames = Set(
            (try? FileManager.default.contentsOfDirectory(
                at: destination,
                includingPropertiesForKeys: nil
            ).map(\.lastPathComponent)) ?? []
        )
        let plans = items.map { item -> (MediaItem, URL) in
            let filename = filenameResolver.resolve(item.name, existingNames: existingNames)
            existingNames.insert(filename)
            return (item, destination.appendingPathComponent(filename))
        }

        let operationQueue = OperationQueue()
        operationQueue.maxConcurrentOperationCount = maxConcurrent
        stateLock.lock()
        cancelled = false
        self.operationQueue = operationQueue
        stateLock.unlock()
        var results = Array<DownloadResult?>(repeating: nil, count: plans.count)
        let lock = NSLock()

        for (index, plan) in plans.enumerated() {
            operationQueue.addOperation { [self] in
                let result: DownloadResult
                if self.isCancelled {
                    result = DownloadResult(
                        itemID: plan.0.id,
                        url: nil,
                        succeeded: false,
                        errorDescription: "下载已取消",
                        sidecarErrorDescription: nil
                    )
                } else {
                    result = self.download(plan.0, to: plan.1, transfer: transfer)
                }
                lock.lock()
                results[index] = result
                lock.unlock()
            }
        }
        operationQueue.waitUntilAllOperationsAreFinished()
        stateLock.lock()
        self.operationQueue = nil
        stateLock.unlock()
        return results.compactMap { $0 }
    }

    private var isCancelled: Bool {
        stateLock.lock()
        defer { stateLock.unlock() }
        return cancelled
    }

    private func download(
        _ item: MediaItem,
        to destination: URL,
        transfer: (MediaItem, URL) throws -> DownloadTransferResult
    ) -> DownloadResult {
        let temporary = destination.deletingLastPathComponent()
            .appendingPathComponent(".\(destination.lastPathComponent).\(UUID().uuidString).tmp")
        defer { try? FileManager.default.removeItem(at: temporary) }

        do {
            let transferResult = try transfer(item, temporary)
            try FileManager.default.moveItem(at: temporary, to: destination)
            return DownloadResult(
                itemID: item.id,
                url: destination,
                succeeded: true,
                errorDescription: nil,
                sidecarErrorDescription: transferResult.sidecarErrorDescription
            )
        } catch {
            return DownloadResult(
                itemID: item.id,
                url: nil,
                succeeded: false,
                errorDescription: error.localizedDescription,
                sidecarErrorDescription: nil
            )
        }
    }
}
