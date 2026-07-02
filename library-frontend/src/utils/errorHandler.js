import Swal from 'sweetalert2';

/**
 * The backend's GlobalExceptionHandler always returns a body shaped like:
 * {
 *   timestamp: string,
 *   status: number,
 *   error: string,
 *   message: string,
 *   path: string,
 *   fieldErrors: { [field: string]: string } | null
 * }
 */
export function parseApiError(error) {
  if (error?.response?.data) {
    const data = error.response.data;
    return {
      status: data.status ?? error.response.status,
      message: data.message || 'An unexpected error occurred.',
      fieldErrors: data.fieldErrors || null,
    };
  }
  if (error?.request) {
    return {
      status: 0,
      message:
        'Could not reach the server. Please make sure the backend is running on http://localhost:8080.',
      fieldErrors: null,
    };
  }
  return {
    status: -1,
    message: error?.message || 'An unexpected error occurred.',
    fieldErrors: null,
  };
}

/**
 * Shows a friendly SweetAlert2 toast/alert for an Axios error, tailored to
 * the HTTP status returned by the backend (400 / 404 / 409 / 500).
 */
export function showApiError(error, fallbackTitle = 'Something went wrong') {
  const { status, message, fieldErrors } = parseApiError(error);

  let title = fallbackTitle;
  if (status === 400) title = 'Invalid request';
  else if (status === 404) title = 'Not found';
  else if (status === 409) title = 'Conflict';
  else if (status >= 500) title = 'Server error';
  else if (status === 0) title = 'Connection error';

  let html = message;
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    html +=
      '<ul style="text-align:left;margin-top:8px;">' +
      Object.entries(fieldErrors)
        .map(([field, msg]) => `<li><strong>${field}</strong>: ${msg}</li>`)
        .join('') +
      '</ul>';
  }

  Swal.fire({
    icon: 'error',
    title,
    html,
    confirmButtonColor: '#1E2A45',
  });

  return { status, message, fieldErrors };
}

export function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: message,
    timer: 1800,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}

export async function confirmAction({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes, continue',
  icon = 'warning',
} = {}) {
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#C6483C',
    cancelButtonColor: '#5B6472',
    reverseButtons: true,
  });
  return result.isConfirmed;
}
