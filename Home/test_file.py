import filetype


def main():
    kind = filetype.guess('/home/thomasvu/Documents/IOTWeb/upload/output_QHCAVxB.png')
    if kind is None:
        print('Cannot guess file type!')
        return

    print('File extension: %s' % kind.extension)
    print('File MIME type: %s' % kind.mime)


if __name__ == '__main__':
    main()
