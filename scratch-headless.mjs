import fs from "fs/promises";

// TODO: Also suppress normal scratch-vm warnings
const originalWarn = console.warn;
console.warn = (message) => {
  if (message.startsWith("\x1B[90mvm\x1B[0m")) return;
  originalWarn(message);
};

(async () => {
  const VirtualMachine = (await import(
    process.argv[2] === "turbowarp" ? "@turbowarp/scratch-vm" : "scratch-vm"
  )).default;

  const vm = new VirtualMachine();

  vm.start();
  vm.clear();

  await vm.loadProject(
    (await fs.readFile("Scratch Runtime Parity Benchmark.sb3")).buffer,
  );

  vm.greenFlag();

  vm.on("PROJECT_RUN_STOP", () => {
    vm.runtime.getTargetForStage().lookupOrCreateList("", "Output").value
      .forEach((line) => console.log(line));
    vm.quit();
  });
})();
