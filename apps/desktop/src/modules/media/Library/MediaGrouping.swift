import Foundation

struct MediaMonthSection: Equatable, Identifiable {
    let id: String
    let items: [MediaItem]
}

enum MediaGrouping {
    static func monthSections(_ items: [MediaItem]) -> [MediaMonthSection] {
        let groups = Dictionary(grouping: stableSort(items)) { monthKey(for: $0) }
        return groups.keys.sorted { left, right in
            if left == "unknown" { return false }
            if right == "unknown" { return true }
            return left > right
        }.map { MediaMonthSection(id: $0, items: groups[$0] ?? []) }
    }

    static func monthKey(for item: MediaItem) -> String {
        guard let date = item.sortDate else { return "unknown" }

        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 0) ?? .gmt
        let components = calendar.dateComponents([.year, .month], from: date)
        guard let year = components.year, let month = components.month else {
            return "unknown"
        }
        return String(format: "%04d-%02d", year, month)
    }

    static func stableSort(_ items: [MediaItem]) -> [MediaItem] {
        items.sorted { left, right in
            switch (left.sortDate, right.sortDate) {
            case let (leftDate?, rightDate?):
                if leftDate != rightDate { return leftDate > rightDate }
            case (_?, nil):
                return true
            case (nil, _?):
                return false
            case (nil, nil):
                break
            }
            return left.id < right.id
        }
    }
}
