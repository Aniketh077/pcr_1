exports.requestConfirmationEmail = (request, material) => {
  return {
    subject: `Request Confirmation - ${request.requestId} | Eco Marketplace`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .details-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #059669; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Request!</h1>
          </div>
          <div class="content">
            <p>Dear ${request.buyerName},</p>
            <p>We have successfully received your request for PCR materials. Our team will review your requirements and contact you within 24-48 hours.</p>

            <div class="details">
              <h3 style="color: #059669; margin-top: 0;">Request Details</h3>
              <div class="details-row">
                <span class="label">Request ID:</span>
                <span>${request.requestId}</span>
              </div>
              <div class="details-row">
                <span class="label">Material:</span>
                <span>${material.name}</span>
              </div>
              <div class="details-row">
                <span class="label">Material Code:</span>
                <span>${material.materialCode}</span>
              </div>
              <div class="details-row">
                <span class="label">Quantity Requested:</span>
                <span>${request.requestedQuantity} ${request.requestedUnit}</span>
              </div>
              <div class="details-row">
                <span class="label">Company:</span>
                <span>${request.companyName}</span>
              </div>
              <div class="details-row">
                <span class="label">Industry:</span>
                <span>${material.industry?.name || 'N/A'}</span>
              </div>
              ${request.specifications ? `
              <div class="details-row">
                <span class="label">Specifications:</span>
                <span>${request.specifications}</span>
              </div>
              ` : ''}
            </div>

            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will verify material availability</li>
              <li>We'll review your specifications and requirements</li>
              <li>You'll receive a follow-up email or call within 24-48 hours</li>
              <li>We'll provide pricing, delivery timeline, and next steps</li>
            </ul>

            <p>If you have any immediate questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p><strong>Eco Marketplace for PCR Materials</strong></p>
            <p>Connecting industries with sustainable recycled materials</p>
            <p>Email: support@ecomarketplace.com | Phone: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

exports.statusUpdateEmail = (request) => {
  const statusMessages = {
    'Reviewed': {
      title: 'Your Request is Under Review',
      message: 'Our team is currently reviewing your request. We will update you shortly with availability and pricing details.'
    },
    'Confirmed': {
      title: 'Your Request has been Confirmed!',
      message: 'Great news! Your request has been confirmed. We are preparing your order and will dispatch it soon.'
    },
    'Dispatched': {
      title: 'Your Order has been Dispatched',
      message: 'Your materials are on their way! You should receive them within the estimated delivery timeframe.'
    },
    'Completed': {
      title: 'Order Completed Successfully',
      message: 'Your order has been completed. Thank you for choosing Eco Marketplace! We hope to serve you again.'
    },
    'Cancelled': {
      title: 'Request Cancelled',
      message: 'Your request has been cancelled. If you have any questions, please contact our support team.'
    }
  };

  const statusInfo = statusMessages[request.status] || {
    title: 'Request Status Update',
    message: `Your request status has been updated to ${request.status}.`
  };

  return {
    subject: `Request Update: ${request.requestId} - ${request.status} | Eco Marketplace`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .status-badge { display: inline-block; background: #059669; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
          .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .details-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #059669; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="content">
            <p>Dear ${request.buyerName},</p>
            <p>${statusInfo.message}</p>

            <div style="text-align: center;">
              <span class="status-badge">Status: ${request.status}</span>
            </div>

            <div class="details">
              <h3 style="color: #059669; margin-top: 0;">Request Summary</h3>
              <div class="details-row">
                <span class="label">Request ID:</span>
                <span>${request.requestId}</span>
              </div>
              <div class="details-row">
                <span class="label">Material:</span>
                <span>${request.material?.name || 'N/A'}</span>
              </div>
              <div class="details-row">
                <span class="label">Quantity:</span>
                <span>${request.requestedQuantity} ${request.requestedUnit}</span>
              </div>
              <div class="details-row">
                <span class="label">Company:</span>
                <span>${request.companyName}</span>
              </div>
              ${request.confirmedAt ? `
              <div class="details-row">
                <span class="label">Confirmed On:</span>
                <span>${new Date(request.confirmedAt).toLocaleDateString()}</span>
              </div>
              ` : ''}
              ${request.dispatchedAt ? `
              <div class="details-row">
                <span class="label">Dispatched On:</span>
                <span>${new Date(request.dispatchedAt).toLocaleDateString()}</span>
              </div>
              ` : ''}
            </div>

            <p>For any questions or concerns, please contact our support team.</p>
          </div>
          <div class="footer">
            <p><strong>Eco Marketplace for PCR Materials</strong></p>
            <p>Email: support@ecomarketplace.com | Phone: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};
