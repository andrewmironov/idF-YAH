//Table of contents configuration--------------------------------------------------------
export const index = {
    index : "index.md",
    type : "block",
    name : "Главная",
    content : [
        {
            type : "point",
            name : "Page 1",
            path : "page1.md"
        },
        {
            type : "point",
            name : "Page 2",
            path : "page2.md"
        },
        {
            type : "block",
            name : "Block 1",
            content : [
                {
                    type : "point",
                    name : "Page 1",
                    path : "page1.md"
                },
                {
                    type : "point",
                    name : "Page 2",
                    path : "page2.md"
                }
            ]
        },
    ]
}