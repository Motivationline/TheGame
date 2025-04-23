/// <reference path="Grid/Grid.ts" />


namespace Script {
  import ƒ = FudgeCore;

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);
  const canvas = document.querySelector("canvas");

  async function start(_event: CustomEvent) {
    viewport = _event.detail;


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    UpdateScriptComponent.updateAllInBranch(viewport.getBranch());
    viewport.draw();
    // ƒ.AudioManager.default.update();
  }


  document.addEventListener("click", startViewport, { once: true });
  async function startViewport() {
    if (ƒ.Project.mode !== ƒ.MODE.RUNTIME) return;
    document.getElementById("click-start").innerText = "Loading...";
    await ƒ.Project.loadResourcesFromHTML();
    let graphId/* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
    let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphId];
    viewport = new ƒ.Viewport();
    let camera = findFirstComponentInGraph(graph, ƒ.ComponentCamera);

    viewport.initialize("game", graph, camera, canvas);
    canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    document.getElementById("click-start").remove();

    setupUI();

    createStartingWorld();
  }

  async function createStartingWorld() {
    const pos = new ƒ.Vector2(15, 15);

    // starter hut
    let starterHut = Building.all.find(b => b.name === "Wohnhaus");
    if (starterHut) await gridBuilder.placeGraphOnGrid(pos, starterHut.size, starterHut.graph);

    // gathering spots
    let foodSpot = Building.all.find(b => b.name === "GatherFood");
    if (foodSpot) {
      for (let i: number = 0; i < 20; i++) {
        pos.set(Math.floor(randomRange(0, 44)), Math.floor(randomRange(0, 44)));
        let tile = grid.getTile(pos, false);
        if (tile) continue;
        await gridBuilder.placeGraphOnGrid(pos, foodSpot.size, foodSpot.graph);
      }
    }
    // gathering spots
    let stoneSpot = Building.all.find(b => b.name === "GatherStone");
    if (stoneSpot) {
      for (let i: number = 0; i < 20; i++) {
        pos.set(Math.floor(randomRange(0, 44)), Math.floor(randomRange(0, 44)));
        let tile = grid.getTile(pos, false);
        if (tile) continue;
        await gridBuilder.placeGraphOnGrid(pos, stoneSpot.size, stoneSpot.graph);
      }
    }
  }
}