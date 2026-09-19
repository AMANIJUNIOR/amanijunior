/**
 * WhatsApp Integration Utilities for Amani Junior Academy and JSS
 * Directly routes parent and visitor inquiries to:
 * Deputy Headteacher & Head of Academics / ICT: Teacher Vitalice Odhiambo (+254 746 529712)
 */

export const VITALICE_WHATSAPP = {
  name: 'Teacher Vitalice Odhiambo',
  role: 'Deputy Headteacher & Head of Academics / ICT',
  phoneFormatted: '+254 746 529712',
  whatsappNumber: '254746529712',
};

export interface WhatsAppMessagePayload {
  parentName?: string;
  phone?: string;
  learnerName?: string;
  gradeOfInterest?: string;
  subject?: string;
  message?: string;
}

/**
 * Generates direct click-to-chat WhatsApp URL for Teacher Vitalice Odhiambo
 */
export function getVitaliceWhatsAppUrl(customMessage?: string): string {
  const defaultText =
    'Hello Teacher Vitalice, I am contacting you regarding Amani Junior Academy & JSS (Mazeras, Kilifi County). I would like to make an inquiry.';
  const text = customMessage || defaultText;
  return `https://wa.me/${VITALICE_WHATSAPP.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Formats a structured message for WhatsApp consultation with Vitalice
 */
export function formatVitaliceWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const lines = [
    '🏫 *AMANI JUNIOR ACADEMY & JSS - DIRECT INQUIRY*',
    '--------------------------------------',
    payload.parentName ? `👤 *Parent/Guardian:* ${payload.parentName}` : null,
    payload.phone ? `📞 *Phone:* ${payload.phone}` : null,
    payload.learnerName ? `🎓 *Learner Name:* ${payload.learnerName}` : null,
    payload.gradeOfInterest ? `📚 *Class/Grade:* ${payload.gradeOfInterest}` : null,
    payload.subject ? `📌 *Inquiry Subject:* ${payload.subject}` : null,
    payload.message ? `💬 *Message:* "${payload.message.trim()}"` : null,
    '--------------------------------------',
    '📍 *School Location:* Mazeras, Kilifi County, Kenya',
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Opens WhatsApp chat directly with Teacher Vitalice in a new tab
 */
export function openVitaliceWhatsApp(payload?: WhatsAppMessagePayload | string): void {
  let url: string;
  if (typeof payload === 'string') {
    url = getVitaliceWhatsAppUrl(payload);
  } else if (payload) {
    const formatted = formatVitaliceWhatsAppMessage(payload);
    url = getVitaliceWhatsAppUrl(formatted);
  } else {
    url = getVitaliceWhatsAppUrl();
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
