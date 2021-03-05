export enum TableDataTypes {
    TEXT = "text",
    LONGTEXT = "longtext",
    NUMBER = "number",
    BOOLEAN = "boolean",
    DATE = "date",
    TIME = "time",
    DATETIME = "datetime",
    LIST = "list",
    PROPERTYLIST = "propertylist",
    CHOICE = "choice",
    MONEY = "money",
    LOOKUP = "look up",
    IMAGE = "image",
    URL = "url",
    FORMULAR = "formular",
    COLLECTION = "collection"
}

export interface TableColumnEntity<C> {
    [name: string]: C;
}
