import XCTest
@testable import exts

final class SQLiteMediaStoreTests: XCTestCase {
    func testPageReturnsOnlyRequestedBatchInStableOrder() throws {
        let store = try SQLiteMediaStore(url: temporaryStoreURL())
        let items = (0..<5).map { index in
            MediaItem(
                id: "item-\(index)",
                name: "IMG_\(index)",
                uti: nil,
                fileSize: Int64(index),
                duration: 0,
                creationDate: Date(timeIntervalSince1970: TimeInterval(index)),
                modificationDate: nil,
                fingerprint: nil
            )
        }

        try store.upsert(items, generation: 1)

        let firstPage = try store.page(after: nil, limit: 2)
        XCTAssertEqual(firstPage.map(\.id), ["item-4", "item-3"])

        let secondPage = try store.page(after: firstPage.last?.id, limit: 2)
        XCTAssertEqual(secondPage.map(\.id), ["item-2", "item-1"])
    }

    func testInterruptedGenerationDoesNotDeletePreviousRecordsUntilCompletion() throws {
        let store = try SQLiteMediaStore(url: temporaryStoreURL())
        let original = makeItem(id: "original")
        let replacement = makeItem(id: "replacement")
        try store.upsert([original], generation: 1)

        let indexer = MediaIndexer(store: store)
        try indexer.sync(generation: 2, items: [replacement], completed: false)
        XCTAssertEqual(try store.allIDs(), ["original", "replacement"])

        try indexer.sync(generation: 2, items: [replacement], completed: true)
        XCTAssertEqual(try store.allIDs(), ["replacement"])
    }

    func testLargeSyntheticLibraryStillReturnsOnlyOnePage() throws {
        let store = try SQLiteMediaStore(url: temporaryStoreURL())
        let items = (0..<400_000).map { index in
            MediaItem(
                id: String(format: "item-%06d", index),
                name: "IMG_\(index)",
                uti: "public.jpeg",
                fileSize: 1,
                duration: 0,
                creationDate: Date(timeIntervalSince1970: TimeInterval(index)),
                modificationDate: nil,
                fingerprint: nil
            )
        }

        try store.upsert(items, generation: 1)

        let page = try store.page(after: nil, limit: 200)
        XCTAssertEqual(page.count, 200)
        XCTAssertEqual(page.first?.id, "item-399999")
    }

    func testPaginationContinuesThroughUnknownDatesAndStopsAtEnd() throws {
        let store = try SQLiteMediaStore(url: temporaryStoreURL())
        let dated = [makeItem(id: "dated-b"), makeItem(id: "dated-a")]
        let undated = ["undated-b", "undated-a"].map { id in
            MediaItem(
                id: id,
                name: id,
                uti: nil,
                fileSize: 0,
                duration: 0,
                creationDate: nil,
                modificationDate: nil,
                fingerprint: nil
            )
        }
        try store.upsert(dated + undated, generation: 1)

        XCTAssertEqual(try store.page(after: nil, limit: 1).map(\.id), ["dated-a"])
        XCTAssertEqual(try store.page(after: "dated-a", limit: 1).map(\.id), ["dated-b"])
        XCTAssertEqual(try store.page(after: "dated-b", limit: 1).map(\.id), ["undated-a"])
        XCTAssertEqual(try store.page(after: "undated-a", limit: 1).map(\.id), ["undated-b"])
        XCTAssertTrue(try store.page(after: "undated-b", limit: 1).isEmpty)
        XCTAssertTrue(try store.page(after: "missing", limit: 1).isEmpty)
        XCTAssertTrue(try store.page(after: nil, limit: 0).isEmpty)
    }

    private func makeItem(id: String) -> MediaItem {
        MediaItem(
            id: id,
            name: id,
            uti: nil,
            fileSize: 0,
            duration: 0,
            creationDate: Date(timeIntervalSince1970: 10),
            modificationDate: nil,
            fingerprint: nil
        )
    }

    private func temporaryStoreURL() -> URL {
        FileManager.default.temporaryDirectory
            .appendingPathComponent("extsTests-\(UUID().uuidString).sqlite")
    }
}
