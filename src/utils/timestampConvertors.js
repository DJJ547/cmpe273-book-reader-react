export function formatMysqlTimestamp(mysqlTimestamp, options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) {
    const date = new Date(mysqlTimestamp);
    
    // Use toLocaleString to format the date based on the options provided
    return date.toLocaleString(undefined, options);
  }