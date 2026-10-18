import XCTest
@testable import exts

final class DownloadCoordinatorTests: XCTestCase {
    func testSummaryReportsSuccessAndRevealsActualDirectory() {
        let directory = URL(fileURLWithPath: "/fixture/downloads", isDirectory: true)
        let summary = DownloadSummary(items: [makeItem(id: "a")], results: [
            DownloadResult(itemID: "a", url: directory.appendingPathComponent("IMG.jpg"), succeeded: true, errorDescription: nil, sidecarErrorDescription: nil)
        ])
        XCTAssertEqual(summary.successCount, 1)
        XCTAssertEqual(summary.failureCount, 0)
        XCTAssertEqual(summary.title, "下载完成")
        XCTAssertEqual(summary.directory, directory)
        XCTAssertEqual(summary.message, "已下载 1 个文件")
    }

    func testSummaryReportsPartialFailureAndMissingResultsWithoutFalseSuccess() {
        let summary = DownloadSummary(items: [makeItem(id: "a"), makeItem(id: "b"), makeItem(id: "c")], results: [
            DownloadResult(itemID: "a", url: URL(fileURLWithPath: "/fixture/IMG.jpg"), succeeded: true, errorDescription: nil, sidecarErrorDescription: nil),
            DownloadResult(itemID: "b", url: nil, succeeded: false, errorDescription: "设备已断开", sidecarErrorDescription: nil)
        ])
        XCTAssertEqual(summary.successCount, 1)
        XCTAssertEqual(summary.failureCount, 2)
        XCTAssertEqual(summary.title, "部分下载失败")
        XCTAssertTrue(summary.message.contains("已下载 1 个文件，2 个失败"))
        XCTAssertTrue(summary.message.contains("设备已断开"))
        XCTAssertTrue(summary.message.contains("未返回下载结果"))
    }

    func testSummaryLimitsFailureDetailsAndDoesNotOfferDirectoryWithoutSuccess() {
        let summary = DownloadSummary(items: (0..<7).map { makeItem(id: "\($0)") }, results: [])
        XCTAssertEqual(summary.successCount, 0)
        XCTAssertEqual(summary.failureCount, 7)
        XCTAssertEqual(summary.title, "下载失败")
        XCTAssertNil(summary.directory)
        XCTAssertEqual(summary.message.components(separatedBy: "未返回下载结果").count - 1, 5)
        XCTAssertTrue(summary.message.contains("另有 2 项未显示"))
    }

    func testSummaryRetainsMainFileSuccessButWarnsAboutSidecar() {
        let summary = DownloadSummary(items: [makeItem(id: "a")], results: [
            DownloadResult(itemID: "a", url: URL(fileURLWithPath: "/fixture/IMG.jpg"), succeeded: true, errorDescription: nil, sidecarErrorDescription: "AAE 下载失败")
        ])
        XCTAssertEqual(summary.successCount, 1)
        XCTAssertEqual(summary.failureCount, 0)
        XCTAssertTrue(summary.message.contains("附属文件：AAE 下载失败"))
    }

    func testDownloadsNeverOverwriteAndRemoveTemporaryFilesOnFailure() throws {
        let destination = FileManager.default.temporaryDirectory
            .appendingPathComponent("extsDownloadTests-\(UUID().uuidString)", isDirectory: true)
        let items = [makeItem(id: "a"), makeItem(id: "b"), makeItem(id: "fail"), makeItem(id: "c")]
        let coordinator = DownloadCoordinator()

        let results = coordinator.enqueue(items: items, destination: destination) { item, temporaryURL in
            if item.id == "fail" { throw TestError.failed }
            try Data(item.id.utf8).write(to: temporaryURL)
            return .success
        }

        XCTAssertEqual(results.filter(\.succeeded).count, 3)
        XCTAssertTrue(FileManager.default.fileExists(atPath: destination.appendingPathComponent("IMG.jpg").path))
        XCTAssertTrue(FileManager.default.fileExists(atPath: destination.appendingPathComponent("IMG (2).jpg").path))
        XCTAssertFalse(try FileManager.default.contentsOfDirectory(at: destination, includingPropertiesForKeys: nil)
            .contains { $0.pathExtension == "tmp" })
        XCTAssertEqual(coordinator.maxConcurrent, 2)
    }

    func testKeepsMainFileSuccessWhenTransferReportsSidecarFailure() throws {
        let destination = FileManager.default.temporaryDirectory
            .appendingPathComponent("extsSidecarTests-\(UUID().uuidString)", isDirectory: true)
        let coordinator = DownloadCoordinator()

        let results = coordinator.enqueue(
            items: [makeItem(id: "sidecar")],
            destination: destination
        ) { _, temporaryURL in
            try Data("main".utf8).write(to: temporaryURL)
            return DownloadTransferResult(sidecarErrorDescription: "AAE 下载失败")
        }

        XCTAssertEqual(results.count, 1)
        XCTAssertTrue(results[0].succeeded)
        XCTAssertEqual(results[0].sidecarErrorDescription, "AAE 下载失败")
        XCTAssertTrue(FileManager.default.fileExists(atPath: results[0].url!.path))
    }

    private func makeItem(id: String) -> MediaItem {
        MediaItem(
            id: id,
            name: "IMG.jpg",
            uti: "public.jpeg",
            fileSize: 1,
            duration: 0,
            creationDate: nil,
            modificationDate: nil,
            fingerprint: nil
        )
    }

    private enum TestError: Error { case failed }
}
