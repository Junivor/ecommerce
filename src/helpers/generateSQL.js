export default function generateSQL({ TABLE = "", FIELDS = "*", WHERE = "" } = {}) {
    let QUERY_FIELDS;
    let QUERY_WHERE = "WHERE ".concat(WHERE)

    if (typeof FIELDS === "string") {
        QUERY_FIELDS = FIELDS
    }
    if (Array.isArray(FIELDS)) {
        QUERY_FIELDS = FIELDS.join(", ")
    }

    return `SELECT ${QUERY_FIELDS} FROM ${TABLE} ${QUERY_WHERE}`
}