import SwiftUI

@main
struct ExtsApp: App {
    @StateObject private var session = DeviceSession()

    var body: some Scene {
        WindowGroup("Exts") {
            Group {
                if session.state == .available {
                    LibraryView(
                        sections: session.mediaSections,
                        images: session.thumbnailImages,
                        failedThumbnailIDs: session.failedThumbnailIDs,
                        onRequestThumbnail: { session.requestThumbnail(for: $0) },
                        onThumbnailVisibilityChange: { session.setThumbnailVisibility(for: $0, isVisible: $1) },
                        onDownload: { session.download(items: $0) }
                    )
                } else {
                    ConnectionView(session: session)
                }
            }
                .onAppear { session.start() }
                .onDisappear { session.stop() }
        }
        .defaultSize(width: 1100, height: 720)
    }
}
