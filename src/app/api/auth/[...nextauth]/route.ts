import { handlers } from "~/server/auth";

    // Na v5, exportamos direto os handlers. Sem wrappers, sem hacks.
    export const { GET, POST } = handlers;