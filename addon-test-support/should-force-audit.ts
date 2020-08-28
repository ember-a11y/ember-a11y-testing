const _url: URL = new URL(window.location.href, document.baseURI);

export function setEnableA11yAudit(enabled: boolean = false) {
  if (enabled) {
    _url.searchParams.set('enableA11yAudit', 'true');
  } else {
    _url.searchParams.delete('enableA11yAudit');
  }
}

export function shouldForceAudit() {
  const url = new URL(window.location.href, document.baseURI);

  return url.searchParams.get('enableA11yAudit') !== null;
}
