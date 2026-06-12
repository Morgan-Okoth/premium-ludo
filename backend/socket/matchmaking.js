const queue = new Map();

function enqueue(player) {
  queue.set(player.id, player);
}

function dequeue() {
  for (const [, v] of queue) return v;
  return null;
}

module.exports = { queue, enqueue, dequeue };
