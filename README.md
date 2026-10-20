# DonutSMP RTP Mapper

This mod maps coordinates in all of DonutSMP's regions. You can configure a guard from the border and spawn, to adjust when you want the bot to stop teleporting. 

The RTP mapper does not automate movement/combat/inventories, spoof coordinates, alter packets, bypass cooldowns, or attempt to evade anti-cheat. Version 1.3.0 also exposes a separate, optional Baritone mining controller for single-player and explicitly permitted private servers. 

Follow every server's current rules and only enable mining where you have permission.

## Download

- Prebuilt JAR: [`site/public/donutsmp-rtp-mapper-1.3.0.jar`](site/public/donutsmp-rtp-mapper-1.3.0.jar) (216,303 bytes, SHA-256 `24524925a929166c5cf899e421a23f4fec1aaeac89c403f23a0e9f5e51eec689`).
- Web download page: <https://site-102406ae8f404268a88ac25b05fc847a.freebuff.page> (served from `site/`, JAR is sent with `Content-Disposition: attachment`).
- Or build it yourself with the commands below.

The download page lives in [`site/`](site) and is a static `index.html` plus a tiny Worker that serves the JAR and SHA-256 file. Run it locally with `cd site && wrangler dev`.

## Requirements

- Minecraft Java Edition 1.21.11
- Java 21
- Fabric Loader 0.19.5 (newest stable; 0.19.3 minimum, anything below 0.19.3 is rejected)
- Fabric API 0.141.6+1.21.11
- Optional: the hardened Baritone API Fabric 1.17.0 integration build for Minecraft 1.21.11

## Build

Clone or extract the project, make Java 21 available, then run:

```bash
./gradlew build
```

On Windows:

```powershell
.\gradlew.bat build
```

The remapped production JAR is generated in `build/libs/` as:

```text
donutsmp-rtp-mapper-1.3.0.jar
```

## Install

1. Install Fabric Loader for Minecraft 1.21.11.
2. Put Fabric API for 1.21.11 in the instance's `mods` folder.
3. Put `donutsmp-rtp-mapper-1.3.0.jar` in the same `mods` folder.
4. Start Minecraft with the Fabric profile.

The JAR is client-only. It is not needed or intended on the server.

## Opening the mapper

There are two ways to open the mapper screen:

1. Press **Right Shift** in game (default keybind, rebindable under **Options → Controls → Key Binds → DonutSMP RTP Mapper**).
2. Press **Esc** in game and click the **RTP Mapper** button in the bottom-left corner of the pause menu.

`/rtpmapper status` in chat prints the same state without opening the screen.

## Optional Baritone mining

## Troubleshooting

### `Unsupported class file major version 65`

The game crashed inside Fabric Loader before this mod was ever loaded. Minecraft 1.21.11 and this mod are compiled for Java 21 (class file major version 65), and the launcher profile is running **Fabric Loader 0.14.6**, whose bundled ASM cannot read Java 21 classes (`McVersionLookup` → `ClassReader` in the stack trace).

Fix it by replacing the profile:

1. Create a fresh Fabric installation for Minecraft 1.21.11 and pick **loader 0.19.3 or newer** (0.14.x, 0.15.x and 0.16.x do not work with 1.21.11).
2. Make sure the launcher's Java runtime is **Java 21**; the mod declares `java >=21` and `fabricloader >=0.19.3` in `fabric.mod.json`.
3. Add Fabric API `0.141.6+1.21.11` and the mapper JAR to `mods`, then launch the new profile.

On Android launchers (PojavLauncher / Mojo) the Fabric version list often defaults to an old loader; set the loader version explicitly when installing Fabric, and check the runtime is JDK 21. If the crash still mentions major version 65, the old profile is still being launched — the stack trace ends in `KnotClient` before any `rtpmapper` class appears.

### `Mod resolution failed` / `Incompatible mods found!`

This one is also the loader, not the mods. A 1.21.11 profile needs **Fabric Loader 0.19.3 or newer**; 0.16.12 (and 0.17.x/0.18.x) is rejected because Fabric API `0.141.6+1.21.11` already requires `fabricloader >= 0.17.3` and this mod requires `>= 0.19.3`:

```text
Mod 'DonutSMP RTP Mapper' (rtpmapper) 1.3.0 requires version 0.19.3 or later
of mod 'Fabric Loader' (fabricloader), but only the wrong version is present: 0.16.12!
```

`0.19.5` is the newest stable loader for Minecraft 1.21.11 (0.20.x is still beta). Reinstall Fabric for 1.21.11 with loader **0.19.5** — the launcher's profile name then reads `fabric-loader-0.19.5-1.21.11`, which you can confirm from the `Selected Minecraft version:` line at the top of `latestlog.txt`. If your launcher's version picker only shows old builds, refresh/update the launcher so it re-reads <https://meta.fabricmc.net/v2/versions/loader/1.21.11>.

Open **Settings → Mining** to configure targets and permissions This hardened API build removes Baritone's separate chat command controller, so mining remains reachable through the mapper's guarded programmatic integration rather than Baritone chat commands. A stock Baritone JAR does not provide that guarantee. Mining is never automatically resumed after a disconnect.

## Data storage

Persistent files are under the Minecraft instance's Fabric config directory:

```text
.minecraft/config/rtpmapper/config.json
.minecraft/config/rtpmapper/rtp_samples.json
.minecraft/config/rtpmapper/rtp_samples.csv
```

User-requested exports are written to:

```text
.minecraft/rtpmapper/exports/rtp_data_YYYY-MM-DD_HH-mm-ss.csv
```

Each sample stores its sequential sample number, full-precision X/Y/Z, dimension identifier, epoch-millisecond timestamp, requested RTP region, and extensible category. “Requested” is intentional: a client-side mapper knows which command target it issued but cannot independently verify the server's physical backend. JSON is authoritative and CSV is maintained as a convenient mirror. CSV exports use:

```csv
sample,x,y,z,distance_from_origin,dimension,timestamp,requested_region
```

The sample JSON schema is version 2. Existing schema-1 samples load safely as `unknown`; the mapper never guesses historical regions from coordinates because server region boundaries can change.

*This project was completely made with Ai, specifically GPT SOL 5.6 I do not claim credit for any of the intellectual property in this build. Please try to improve this if you can.
