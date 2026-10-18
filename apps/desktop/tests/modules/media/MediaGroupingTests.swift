import XCTest
@testable import exts

final class MediaGroupingTests: XCTestCase {
    func testMonthSectionsShowNewestMonthAndNewestDatesFirst() {
        func item(_ id: String, _ date: String?, modified: String? = nil) -> MediaItem {
            let formatter = ISO8601DateFormatter()
            return MediaItem(
                id: id, name: id, uti: nil, fileSize: 0, duration: 0,
                creationDate: date.flatMap { formatter.date(from: $0) },
                modificationDate: modified.flatMap { formatter.date(from: $0) },
                fingerprint: nil
            )
        }
        let sections = MediaGrouping.monthSections([
            item("old", "2026-09-30T12:00:00Z"),
            item("early", "2026-10-01T12:00:00Z"),
            item("unknown", nil),
            item("latest-b", "2026-10-19T12:00:00Z"),
            item("fallback", nil, modified: "2026-10-10T12:00:00Z"),
            item("latest-a", "2026-10-19T12:00:00Z")
        ])

        XCTAssertEqual(sections.map(\.id), ["2026-10", "2026-09", "unknown"])
        XCTAssertEqual(sections[0].items.map(\.id), ["latest-a", "latest-b", "fallback", "early"])
        XCTAssertEqual(sections[1].items.map(\.id), ["old"])
        XCTAssertEqual(sections[2].items.map(\.id), ["unknown"])
        XCTAssertTrue(MediaGrouping.monthSections([]).isEmpty)
    }

    func testSortDatePrefersCreationThenModificationThenUnknown() {
        let modification = Date(timeIntervalSince1970: 1_000)
        let creation = Date(timeIntervalSince1970: 2_000)

        let item = MediaItem(
            id: "photo-1",
            name: "IMG_1.HEIC",
            uti: "public.heic",
            fileSize: 10,
            duration: 0,
            creationDate: creation,
            modificationDate: modification,
            fingerprint: nil
        )

        XCTAssertEqual(item.sortDate, creation)
        XCTAssertEqual(MediaGrouping.monthKey(for: item), "1970-01")

        let fallback = MediaItem(
            id: item.id,
            name: item.name,
            uti: item.uti,
            fileSize: item.fileSize,
            duration: item.duration,
            creationDate: nil,
            modificationDate: modification,
            fingerprint: item.fingerprint
        )
        XCTAssertEqual(fallback.sortDate, modification)
        XCTAssertEqual(MediaGrouping.monthKey(for: fallback), "1970-01")

        let unknown = MediaItem(
            id: fallback.id,
            name: fallback.name,
            uti: fallback.uti,
            fileSize: fallback.fileSize,
            duration: fallback.duration,
            creationDate: nil,
            modificationDate: nil,
            fingerprint: fallback.fingerprint
        )
        XCTAssertEqual(unknown.sortDate, nil)
        XCTAssertEqual(MediaGrouping.monthKey(for: unknown), "unknown")
    }

    func testStableSortUsesDateDescendingThenIdentifier() {
        let date = Date(timeIntervalSince1970: 10_000)
        let later = MediaItem(
            id: "b",
            name: "b",
            uti: nil,
            fileSize: 0,
            duration: 0,
            creationDate: date,
            modificationDate: nil,
            fingerprint: nil
        )
        let earlier = MediaItem(
            id: "a",
            name: "a",
            uti: nil,
            fileSize: 0,
            duration: 0,
            creationDate: date,
            modificationDate: nil,
            fingerprint: nil
        )

        XCTAssertEqual(MediaGrouping.stableSort([later, earlier]).map(\.id), ["a", "b"])
    }
}
