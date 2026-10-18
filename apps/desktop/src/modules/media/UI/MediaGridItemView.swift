import AppKit
import SwiftUI

struct MediaGridItemView: View {
    let item: MediaItem
    let image: NSImage?
    let thumbnailFailed: Bool
    let isSelected: Bool
    let toggle: () -> Void
    let requestThumbnail: () -> Void
    let visibilityChanged: (Bool) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Rectangle()
                .fill(.quaternary)
                .frame(height: 140)
                .overlay {
                    if let image {
                        Image(nsImage: image)
                            .resizable()
                            .scaledToFill()
                    } else if thumbnailFailed {
                        VStack(spacing: 6) {
                            Image(systemName: "exclamationmark.triangle")
                            Button("重试", action: requestThumbnail)
                                .buttonStyle(.link)
                        }
                    } else {
                        ProgressView()
                    }
                }
                .clipped()
            Text(item.name)
                .lineLimit(1)
                .font(.caption)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(4)
        .contentShape(Rectangle())
        .onTapGesture(perform: toggle)
        .onScrollVisibilityChange(threshold: 0.01, visibilityChanged)
        .onDisappear { visibilityChanged(false) }
        .overlay {
            RoundedRectangle(cornerRadius: 4)
                .stroke(isSelected ? Color.accentColor : .clear, lineWidth: 2)
        }
    }
}
