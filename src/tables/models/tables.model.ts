export enum TableDataTypes {
    TEXT = "text",
    LONG_TEXT = "long text",
    NUMBER = "number",
    SELECT = "select",
    MONEY = "money",
    DATE = "date",
    TIME = "time",
    DATE_TIME = "date time",
    LOOKUP = "look up",
    BOOLEAN = "boolean",
    IMAGE = "image",
    URL = "url",
    FORMULAR = "formular",
    STATUS = "status",
    COLLECTION = "collection"
}

export interface TableColumnEntity<C> {
    [name: string]: C;
}
