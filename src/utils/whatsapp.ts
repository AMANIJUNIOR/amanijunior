/**
 * WhatsApp Integration Utilities for Golden Span Technologies Limited
 * Directly routes customer inquiries to Directors:
 * 1. Prestine Otieno Odhiambo (MD): +254 745 684291
 * 2. Cynthia Atieno Omondi (Director): +254 796 838799
 */

export const DIRECTORS_WHATSAPP = {
  prestine: {
    name: 'Prestine Otieno Odhiambo',
    role: 'Managing Director & Co-Founder',
    phoneFormatted: '+254 745 684291',
    whatsappNumber: '254745684291',
  },
  cynthia: {
    name: 'Cynthia Atieno Omondi',
    role: 'Director & Co-Founder',
    phoneFormatted: '+254 796 838799',
    whatsappNumber: '254796838799',
  },
};

export interface WhatsAppMessagePayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceOrSubject: string;
  message?: string;
  referenceNumber?: string;
  urgency?: 'STANDARD' | 'URGENT' | 'HIGH';
}

/**
 * Formats a professional, structured WhatsApp message for Golden Span Directors
 */
export function formatWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const timestamp = new Date().toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  });

  const lines = [
    '🚨 *URGENT CLIENT INQUIRY - GOLDEN SPAN TECHNOLOGIES*',
    '--------------------------------------',
    payload.referenceNumber ? `📌 *Reference:* ${payload.referenceNumber}` : null,
    `👤 *Client Name:* ${payload.clientName || 'Website Visitor'}`,
    `📞 *Client Phone:* ${payload.clientPhone}`,
    payload.clientEmail ? `✉️ *Email:* ${payload.clientEmail}` : null,
    `🏢 *Subject / Service:* ${payload.serviceOrSubject}`,
    payload.urgency ? `⚡ *Priority:* ${payload.urgency}` : null,
    payload.message ? `💬 *Message:* "${payload.message.trim()}"` : null,
    '--------------------------------------',
    `🕒 *Sent at:* ${timestamp}`,
    '📍 *Platform:* Golden Span Technologies Portal (Bishop\'s Plaza, Siaya)',
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Generates direct click-to-chat WhatsApp URL for a specific director
 */
export function getWhatsAppUrl(
  directorKey: 'prestine' | 'cynthia',
  messageText: string
): string {
  const director = DIRECTORS_WHATSAPP[directorKey];
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${director.whatsappNumber}?text=${encodedText}`;
}

/**
 * Opens WhatsApp chat in a new tab/window for both directors or specific director
 */
export function openWhatsAppChat(
  directorKey: 'prestine' | 'cynthia',
  payload: WhatsAppMessagePayload
): void {
  const message = formatWhatsAppMessage(payload);
  const url = getWhatsAppUrl(directorKey, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Dispatches WhatsApp message to BOTH directors simultaneously
 */
export function openBothDirectorsWhatsApp(payload: WhatsAppMessagePayload): void {
  const message = formatWhatsAppMessage(payload);
  const urlPrestine = getWhatsAppUrl('prestine', message);
  const urlCynthia = getWhatsAppUrl('cynthia', message);

  // Open Prestine in active new tab
  window.open(urlPrestine, '_blank', 'noopener,noreferrer');

  // Open Cynthia after short delay so browser doesn't block second popup
  setTimeout(() => {
    window.open(urlCynthia, '_blank', 'noopener,noreferrer');
  }, 400);
}
