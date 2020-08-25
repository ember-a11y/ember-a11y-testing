let _url: URL = new URL(window.location.href, document.baseURI);

export function setEnableA11yAudit(enabled: boolean = false) {
  if (enabled) {
    _url.searchParams.set('enableA11yAudit', 'true');
  } else {
    _url.searchParams.delete('enableA11yAudit');
  }
}

export function shouldForceAudit() {
  return _url.searchParams.get('enableA11yAudit') !== null;
}
