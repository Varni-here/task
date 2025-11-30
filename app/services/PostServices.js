import { post, put, deleteApi } from "./ApiMethods";
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, RESTORE_EVENT } from "../constants/ApiRoutes";

export const CreateEvent = async (eventData) => {
    return post(CREATE_EVENT, eventData);
};

export const UpdateEvent = async (id, eventData) => {
    return put(UPDATE_EVENT + id, eventData);
};

export const StopEvent = async (id) => {
    return deleteApi(DELETE_EVENT + id);
};

export const HardDeleteEvent = async (id) => {
    return deleteApi(DELETE_EVENT + id, { hard: "true" });
};

export const RestoreEvent = async (id) => {
    return put(RESTORE_EVENT + id + "?restore=true");
};