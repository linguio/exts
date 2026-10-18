import Foundation

struct AppStoragePaths {
    let thumbnailDirectory: URL
    let downloadDirectory: URL

    static var current: AppStoragePaths {
        AppStoragePaths(
            bundleIdentifier: Bundle.main.bundleIdentifier ?? "dev.linguio.exts",
            homeDirectory: FileManager.default.homeDirectoryForCurrentUser,
            applicationSupportDirectory: FileManager.default.urls(
                for: .applicationSupportDirectory,
                in: .userDomainMask
            )[0]
        )
    }

    init(bundleIdentifier: String, homeDirectory: URL, applicationSupportDirectory: URL) {
        // 缓存保留原有身份隔离，下载按用户批准的产品目录共用，不迁移旧文件。
        let directoryName = bundleIdentifier == "dev.linguio.exts.dev" ? "Exts Dev" : "OhMy Photos"
        thumbnailDirectory = applicationSupportDirectory
            .appendingPathComponent(directoryName, isDirectory: true)
            .appendingPathComponent("Thumbnails", isDirectory: true)
        downloadDirectory = homeDirectory
            .appendingPathComponent("Downloads", isDirectory: true)
            .appendingPathComponent("Exts Downloads", isDirectory: true)
            .appendingPathComponent("Photos", isDirectory: true)
    }
}
