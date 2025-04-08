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
    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  
  document.addEventListener("click", startViewport, { once: true });
  async function startViewport() {

    await ƒ.Project.loadResourcesFromHTML();
    let graphId/* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView");
    let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources[graphId];
    viewport = new ƒ.Viewport();
    let camera = findFirstCameraInGraph(graph);

    viewport.initialize("game", graph, camera, canvas);
    canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));

    setupUI();
  }
}