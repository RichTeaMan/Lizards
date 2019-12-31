import { MessagePayload } from "../messageBus/MessagePayload";

export class ToastPayload implements MessagePayload {

    toastMessage: string;

    durationMilliseconds: number = 2000;

    getType(): string {
        return "toast";
    }

    static createToast(message: string): ToastPayload {
        const toast = new ToastPayload();
        toast.toastMessage = message;
        return toast;
    }

}
