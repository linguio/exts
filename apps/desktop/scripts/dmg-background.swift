import AppKit

guard CommandLine.arguments.count == 2 else {
    fatalError("需要指定安装背景输出路径")
}

let size = NSSize(width: 640, height: 400)
let image = NSImage(size: size)
image.lockFocusFlipped(true)
NSColor(calibratedWhite: 0.97, alpha: 1).setFill()
NSBezierPath(rect: NSRect(origin: .zero, size: size)).fill()

func text(_ value: String, y: CGFloat, size: CGFloat, color: NSColor, weight: NSFont.Weight) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = .center
    (value as NSString).draw(in: NSRect(x: 32, y: y, width: 576, height: 42), withAttributes: [
        .font: NSFont.systemFont(ofSize: size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
    ])
}

text("安装 Exts", y: 38, size: 27, color: NSColor(calibratedWhite: 0.15, alpha: 1), weight: .semibold)
text("将 Exts 拖到右侧，即可完成安装", y: 85, size: 14, color: NSColor(calibratedWhite: 0.45, alpha: 1), weight: .regular)

// 箭头只作为拖拽说明，不更改应用或系统文件夹图标。
let arrow = NSBezierPath()
arrow.move(to: NSPoint(x: 291, y: 200))
arrow.line(to: NSPoint(x: 349, y: 200))
arrow.move(to: NSPoint(x: 336, y: 187))
arrow.line(to: NSPoint(x: 349, y: 200))
arrow.line(to: NSPoint(x: 336, y: 213))
arrow.lineWidth = 3
arrow.lineCapStyle = .round
arrow.lineJoinStyle = .round
NSColor(calibratedWhite: 0.62, alpha: 1).setStroke()
arrow.stroke()

text("安装后，请从“应用程序”打开 Exts", y: 326, size: 12, color: NSColor(calibratedWhite: 0.5, alpha: 1), weight: .regular)
image.unlockFocus()

guard let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("无法生成安装背景")
}
try png.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
