import { format } from "date-fns";
import { fr } from "date-fns/locale";

const invoiceNumber = (date, id) => {
  const formattedDate = format(new Date(date), "yyyy-MM", { locale: fr });
  const paddedId = String(id).padStart(5, "0");
  const invoiceNumber = formattedDate + "-" + paddedId;
  return invoiceNumber;
};

export { invoiceNumber };
