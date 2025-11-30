import { get } from "./ApiMethods";
import { GET_ALL_EVENTS, GET_SINGLE_EVENT } from "../constants/ApiRoutes";

export const GetAllEvents = async (params = {}) => {
    return get(GET_ALL_EVENTS, params);
};

export const GetSingleEvent = async (id) => {
    return get(GET_SINGLE_EVENT + id);
};