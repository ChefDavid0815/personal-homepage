# Courtside collection / 建模展厅

Two independent works, three real model views: Chase Center (interior/exterior) and a Stephen Curry head study. 两件独立作品，三个真实模型视角。

## Models

- `arena.glb`, `exterior.glb`: display exports from ChefZC's Chase Center CP80 Blender project. Interior uses a roof-open cutaway and reduced seating density; the native project remains in the arena model release. Geometry is reference-informed, not a surveyed reconstruction.
- `curry.glb`: display export of the existing Unreal CP023 head assets, prepared from a purchased third-party MNJ mod. Eight geometry parts; face/neck material regions restored from the Unreal source after FBX export. Web iris material is newly authored and procedural, without Epic eye texture files. Native bones/materials are in the separate player release.
- `seat.glb`, `seats.json`: actual chair geometry and placements from the arena's Geometry Nodes instances; the web renderer displays one in two placements for performance.

## Images & design

`arena-case.png`, `exterior-case.png` and `curry-case.png` are Blender Cycles renders of the actual model display copies, in an authored glass-and-blue/gold studio. They are not generated depictions of an unbuilt model. The web renderer uses real geometry and simplified real-time materials; rendered photographs and realtime output are not pixel-identical.

三个封面使用实际模型展示副本在 Blender Cycles 中渲染。光学玻璃、蓝金展台和灯光为本次陈列设计，网页加载真实几何与简化实时材质，离线渲染与实时画面不保证像素一致。

- Warriors mark: https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg .
- NBA mark: the existing modeling project's credited `NBA_2017_Based5290.svg` asset.
- NBA, Warriors, venue/sponsor marks and likenesses remain with their rights holders. Unofficial fan collection. Free download does not relicense third-party components.
- Three.js 0.180.0: MIT, see `THREE-LICENSE.txt`.
- Draco decoder: Apache 2.0; bundled from Three.js 0.180.0, see `DRACO-LICENSE.txt`.

No source reference-photo libraries, research, cache folders, credentials or process backups are published.
