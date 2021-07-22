import { RealZipFS } from "./realZipfs";

window.stratum = window.stratum ?? {};
window.stratum.unzip = RealZipFS.create;
