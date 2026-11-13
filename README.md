# calico.frontend

Calico Smart Homes – Calico web arayüzü: yönetim, filo ve tema paneli. Yalnızca bulut üzerinden
çalışır; evlerdeki kutulara doğrudan bağlanmaz.

Bugün: Vite + React + TypeScript iskeleti, Calico tasarım sistemi (renkler, yazı tipleri,
ikonlar, açık/koyu tema) ve kenar çubuğunda üç bölüm (Evler, Filo, Temalar). Bölümler Calico
Cloud servisleri hazır olduğunda dolacak.

Tasarım tokenları `@harunmarangoz/calico-design` paketinden gelir (GitHub Packages, özel).
Kurulumdan önce `read:packages` yetkili bir GitHub token'ı `NPM_TOKEN` ortam değişkenine koyun:

```sh
export NPM_TOKEN=<token>
npm ci
npm run dev
```

Mimari plan: [calico.root/docs/plans/hibrit-mimari-plani.md](https://github.com/harunmarangoz/calico.root/blob/main/docs/plans/hibrit-mimari-plani.md)
