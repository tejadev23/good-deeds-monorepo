/**
 * Curated, free-licence Unsplash photographs (https://unsplash.com/license).
 * Images are hot-linked from the Unsplash CDN; `SmartImage` renders a branded
 * fallback if any asset is unavailable.
 */
const UNSPLASH_BASE = "https://images.unsplash.com";

export function unsplash(photoId: string, width = 1080, height?: number): string {
  const size = height ? `&w=${width}&h=${height}&fit=crop` : `&w=${width}`;
  return `${UNSPLASH_BASE}/${photoId}?auto=format&q=75${size}`;
}

export function avatarUrl(photoId: string): string {
  return `${UNSPLASH_BASE}/${photoId}?auto=format&q=75&w=240&h=240&fit=crop&crop=faces`;
}

export const PHOTOS = {
  treePlanting: [
    "photo-1542601906990-b4d3fb778b09",
    "photo-1598335624134-5bceb5de202d",
    "photo-1622383563227-04401ab4e5ea",
    "photo-1625758476104-f2ed6c81248f",
    "photo-1591255199673-4e2b706645a2",
    "photo-1710361006404-a13d01802ce9",
  ],
  garden: [
    "photo-1524247108137-732e0f642303",
    "photo-1611843467160-25afb8df1074",
    "photo-1621460248083-6271cc4437a8",
    "photo-1515150144380-bca9f1650ed9",
    "photo-1523348837708-15d4a09cfac2",
    "photo-1591857177580-dc82b9ac4e1e",
    "photo-1781785273371-a959f34bfab0",
  ],
  cleanup: [
    "photo-1758599668949-5118d71838fd",
    "photo-1758599669064-89f1ffe5c8d8",
    "photo-1751646312130-d6be98d867bf",
    "photo-1758599669016-acedd3942ca2",
    "photo-1610093674388-cee0337f2684",
    "photo-1618477461853-cf6ed80faba5",
    "photo-1758599669008-fb6f8eda6f53",
    "photo-1758599669317-efd787d954ef",
  ],
  dogs: [
    "photo-1674802401345-4e6ec9fc2146",
    "photo-1667822930408-83bb331d1f3f",
    "photo-1742931607806-73d541c7a1c4",
    "photo-1751809999546-6b6bddab9f7d",
    "photo-1626648701445-1f67aeb6e49c",
    "photo-1672826642602-b220ae45d56b",
  ],
  cats: [
    "photo-1581536678522-afcf3257d780",
    "photo-1772461286831-e46c4f40bd41",
    "photo-1702852576837-cac81a9d2397",
    "photo-1791398423357-bef0cf9d9ae1",
  ],
  shelter: [
    "photo-1594004844563-536a03a6e532",
    "photo-1560743641-3914f2c45636",
    "photo-1604606363386-dd3f2357ad87",
    "photo-1558618047-f4b511aae74d",
    "photo-1594005374167-5fd900fb82c9",
  ],
  food: [
    "photo-1599059813005-11265ba4b4ce",
    "photo-1593113616828-6f22bca04804",
    "photo-1628717341663-0007b0ee2597",
    "photo-1593113598332-cd288d649433",
    "photo-1588964895597-cfccd6e2dbf9",
    "photo-1608686207856-001b95cf60ca",
    "photo-1593113646773-028c64a8f1b8",
  ],
  kitchen: ["photo-1761300463257-7a6b70d43c27", "photo-1763570645098-371723617ee9", "photo-1777427676365-d84b81691767"],
  clothes: [
    "photo-1604176354204-9268737828e4",
    "photo-1567113463300-102a7eb3cb26",
    "photo-1750340705994-fabc08b49053",
    "photo-1604072374690-0e7d7bddd54e",
  ],
  elderly: [
    "photo-1773227055624-07b515ba87c5",
    "photo-1762955911431-4c44c7c3f408",
    "photo-1773227059334-38d10a9075f2",
    "photo-1773227059780-5e865ce7fb13",
    "photo-1761839257513-a921710a4291",
    "photo-1765896387387-0538bc9f997e",
  ],
  teaching: [
    "photo-1577896851231-70ef18881754",
    "photo-1588072432836-e10032774350",
    "photo-1761604478724-13fe879468cf",
    "photo-1588075592405-d3d4f0846961",
    "photo-1583468982228-19f19164aee2",
    "photo-1587323655395-b1c77a12c89a",
    "photo-1636202339022-7d67f7447e3a",
  ],
  books: ["photo-1455884981818-54cb785db6fc", "photo-1573309463355-c53f9ebea408", "photo-1532789339108-2ebc484efbf1", "photo-1716324339623-384495f47373"],
  volunteers: [
    "photo-1783028104792-8506735c0383",
    "photo-1652971876875-05db98fab376",
    "photo-1616680214084-22670de1bc82",
    "photo-1488521787991-ed7bbaae773c",
    "photo-1557660559-42497f78035b",
    "photo-1559027615-cd4628902d4a",
  ],
  landscapes: [
    "photo-1501854140801-50d01698950b",
    "photo-1506260408121-e353d10b87c7",
    "photo-1764007511995-84800b7d3d92",
    "photo-1603705502222-4356c929be57",
    "photo-1438786657495-640937046d18",
    "photo-1598871955824-3db4b5f9494d",
    "photo-1606922898091-fcccd33cd6fb",
    "photo-1600206287932-4b8888bd78f6",
    "photo-1622042795081-c27996872dbc",
    "photo-1497436072909-60f360e1d4b1",
    "photo-1502082553048-f009c37129b9",
    "photo-1503435980610-a51f3ddfee50",
    "photo-1462143338528-eca9936a4d09",
  ],
  hero: "photo-1542601906990-b4d3fb778b09",
} as const;

export const PORTRAITS = {
  women: [
    "photo-1662850886700-4ec19bd30d11",
    "photo-1489278353717-f64c6ee8a4d2",
    "photo-1562337404-3044c84ac061",
    "photo-1534180477871-5d6cc81f3920",
    "photo-1567516364473-233c4b6fcfbe",
    "photo-1564564295391-7f24f26f568b",
    "photo-1630939687530-241d630735df",
    "photo-1623717217554-72ca676de535",
    "photo-1611695434369-a8f5d76ceb7b",
    "photo-1595085610896-fb31cfd5d4b7",
    "photo-1548382131-e0ebb1f0cdea",
    "photo-1607746882042-944635dfe10e",
    "photo-1619896382906-4f4681290afc",
    "photo-1594318223885-20dc4b889f9e",
    "photo-1584367034980-8ba72c175f4f",
    "photo-1516022531723-ed0d24058337",
  ],
  men: [
    "photo-1568602471122-7832951cc4c5",
    "photo-1590086782792-42dd2350140d",
    "photo-1757744705465-ea08b0ddc38a",
    "photo-1522529599102-193c0d76b5b6",
    "photo-1566753323558-f4e0952af115",
    "photo-1564564244660-5d73c057f2d2",
    "photo-1603559822934-c01e9aa89708",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1600603406200-5b2a104684ac",
    "photo-1625241152315-4a698f74ceb7",
    "photo-1592234789031-94bf65f630ed",
    "photo-1583264277168-58ceba4b84e7",
    "photo-1607346256330-dee7af15f7c5",
    "photo-1535270732370-dd3188bab1da",
    "photo-1670679897756-c086f8d26f36",
  ],
} as const;
