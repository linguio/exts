import AppKit
import SwiftUI

struct LibraryView: View {
    let sections: [MediaMonthSection]
    let images: [String: NSImage]
    let failedThumbnailIDs: Set<String>
    let onRequestThumbnail: (String) -> Void
    let onThumbnailVisibilityChange: (String, Bool) -> Void
    let onDownload: ([MediaItem]) -> [DownloadResult]
    @StateObject private var selection: SelectionStore
    @State private var downloadSummary: DownloadSummary?

    init(
        sections: [MediaMonthSection],
        images: [String: NSImage] = [:],
        failedThumbnailIDs: Set<String> = [],
        onRequestThumbnail: @escaping (String) -> Void = { _ in },
        onThumbnailVisibilityChange: @escaping (String, Bool) -> Void = { _, _ in },
        onDownload: @escaping ([MediaItem]) -> [DownloadResult] = { _ in [] }
    ) {
        self.sections = sections
        self.images = images
        self.failedThumbnailIDs = failedThumbnailIDs
        self.onRequestThumbnail = onRequestThumbnail
        self.onThumbnailVisibilityChange = onThumbnailVisibilityChange
        self.onDownload = onDownload
        _selection = StateObject(wrappedValue: SelectionStore())
    }

    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 24) {
                ForEach(sections) { section in
                    let monthItems = section.items
                    MonthSectionView(
                        title: section.id,
                        items: monthItems,
                        images: images,
                        failedThumbnailIDs: failedThumbnailIDs,
                        requestThumbnail: onRequestThumbnail,
                        thumbnailVisibilityChanged: onThumbnailVisibilityChange,
                        selectedIDs: selection.selectedIDs,
                        selectionState: selection.state(for: monthItems.map(\.id)),
                        toggleItem: { selection.toggle(id: $0) },
                        toggleMonth: { selection.toggle(monthIDs: monthItems.map(\.id)) },
                        downloadSelected: {
                            let selectedIDs = selection.selectedIDs(in: monthItems.map(\.id))
                            let selected = monthItems.filter { selectedIDs.contains($0.id) }
                            let results = onDownload(selected)
                            let successfulIDs = Set(
                                results.filter { $0.succeeded }.map(\.itemID)
                            )
                            selection.remove(ids: successfulIDs)
                            downloadSummary = DownloadSummary(items: selected, results: results)
                        }
                    )
                }
            }
            .padding(24)
        }
        .alert(item: $downloadSummary) { summary in
            if let directory = summary.directory {
                Alert(
                    title: Text(summary.title),
                    message: Text(summary.message),
                    primaryButton: .default(Text("在 Finder 中查看")) {
                        NSWorkspace.shared.open(directory)
                    },
                    secondaryButton: .cancel(Text("完成"))
                )
            } else {
                Alert(
                    title: Text(summary.title),
                    message: Text(summary.message),
                    dismissButton: .default(Text("好"))
                )
            }
        }
    }

}
