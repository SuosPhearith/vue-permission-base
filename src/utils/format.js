// // ::::::::::::::::::::::::::::::::::::::: DD-MM-YYYY HH:MM
// export function formatDateDDMMYYHHMM(input) {
//   const date = new Date(input);

//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();

//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');

//   return `${day}-${month}-${year} ${hours}:${minutes}`;
// }

// ::::::::::::::::::::::::::::::::::::::: FORMATTER FUNCTIONS

export function formatDateDDMMYYHHMM(input) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDateDDMMSlashYYHHMM(input) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatDateYYMMDDHHMM(input) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// ::::::::::::::::::::::::::::::::::::::: MAIN FORMATTER USING SELECTED ID

export function formatDateBySelectedFormat(input) {
  let config = localStorage.getItem("config")
    ? JSON.parse(localStorage.getItem("config"))
    : {};

  switch (config?.datetime_format?.active) {
    case 1:
      return formatDateDDMMYYHHMM(input);
    case 2:
      return formatDateDDMMSlashYYHHMM(input);
    case 3:
      return formatDateYYMMDDHHMM(input);
    default:
      // fallback to ISO string or a default format
      return new Date(input).toISOString();
  }
}
