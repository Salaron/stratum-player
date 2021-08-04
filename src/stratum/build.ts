import { options } from "./options";
import { RealPlayer } from "./player";
window.stratum = window.stratum ?? {};
window.stratum.player = RealPlayer.create;
window.stratum.options = options;
window.stratum.version = "0.11.0";
