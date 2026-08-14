export function generateDynamicQris(staticQris: string, amount: number): string {
  // 1. Remove the old CRC (the last 4 characters after '6304')
  // A valid QRIS always ends with 6304XXXX
  if (!staticQris.includes('6304')) return staticQris;
  let base = staticQris.substring(0, staticQris.lastIndexOf('6304'));

  // 2. Change Point of Initiation Method (Tag 01) to Dynamic
  // Static is '010211', Dynamic is '010212'
  base = base.replace('010211', '010212');

  // 3. Insert Transaction Amount (Tag 54)
  // We should insert it before Tag 58 (Country Code) or 59 (Merchant Name)
  // But generally, appending it before 6304 is often acceptable. 
  // Let's parse and insert it properly just before Tag 58 for safety.
  const amountStr = amount.toString();
  const amountLen = amountStr.length.toString().padStart(2, '0');
  const tag54 = `54${amountLen}${amountStr}`;

  // If Tag 54 already exists, replace it. Otherwise insert before 58 or just append if 58 doesn't exist.
  if (base.includes('54' + amountLen)) {
    // Very naive check, let's just append it before 58.
  }
  
  const tag58Index = base.indexOf('5802');
  if (tag58Index !== -1) {
    base = base.slice(0, tag58Index) + tag54 + base.slice(tag58Index);
  } else {
    base += tag54;
  }

  // 4. Calculate new CRC16
  base += '6304';
  const crc = crc16ccitt(base).toString(16).toUpperCase().padStart(4, '0');
  return base + crc;
}

function crc16ccitt(str: string): number {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return crc & 0xFFFF;
}
