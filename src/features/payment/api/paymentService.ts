import { api } from '@/shared/api/axiosConfig';

export interface WayForPayFormData {
    merchantAccount:    string;
    merchantDomainName: string;
    orderReference:     string;
    orderDate:          string;
    amount:             string;
    currency:           string;
    orderTimeout:       string;
    productName:        string;
    productCount:       string;
    productPrice:       string;
    returnUrl:          string;
    serviceUrl:         string;
    merchantSignature:  string;
}

export const createPaymentForm = async (
    rentalId: number,
    email?: string
): Promise<WayForPayFormData> => {
    const response = await api.post<WayForPayFormData>(
        '/payments/create-form',
        { rentalId, email }
    );
    return response.data;
};

// Будує HTML-форму і сабмітить → редірект на сторінку WayForPay
export const redirectToWayForPay = (formData: WayForPayFormData): void => {
    const checkoutUrl = import.meta.env.VITE_WFP_CHECKOUT_URL as string;
    if (!checkoutUrl) throw new Error('VITE_WFP_CHECKOUT_URL is not defined in .env');

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = checkoutUrl;
    form.accept = 'UTF-8';
    form.style.display = 'none';

    const fields: Record<string, string> = {
        merchantAccount:    formData.merchantAccount,
        merchantDomainName: formData.merchantDomainName,
        orderReference:     formData.orderReference,
        orderDate:          formData.orderDate,
        amount:             formData.amount,
        currency:           formData.currency,
        orderTimeout:       formData.orderTimeout,
        returnUrl:          formData.returnUrl,
        serviceUrl:         formData.serviceUrl,
        merchantSignature:  formData.merchantSignature,
    };

    for (const [name, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    // Масивні поля для одного продукту
    const arrayFields: Record<string, string> = {
        'productName[]':  formData.productName,
        'productCount[]': formData.productCount,
        'productPrice[]': formData.productPrice,
    };

    for (const [name, value] of Object.entries(arrayFields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
};
