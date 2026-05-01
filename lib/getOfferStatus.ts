import { Offer } from "./types";

export const getOfferStatus = (offer: Offer) => {
    const now = new Date();
    const start = offer.start_date ? new Date(offer.start_date) : null;
    const end = offer.end_date ? new Date(offer.end_date) : null;
    if (end && now > end) return "inactive";
    if (start && now < start) return "upcoming";
    return "active";
};