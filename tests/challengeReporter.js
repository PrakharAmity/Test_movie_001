/**
 * CinePulse Debugging Challenge Reporter
 * 
 * Complies with the Execution Engine contract:
 * - Suppresses verbose Vitest banners and stack traces
 * - Outputs strictly the required JSON schema
 * - Computes individual bug statuses and execution times
 */

export default class ChallengeReporter {
  onFinished(files = [], errors = []) {
    const bugSuites = [];

    function traverseTasks(tasks) {
      if (!tasks) return;
      for (const task of tasks) {
        if (task.type === 'suite' && /^Bug\s+\d+:/i.test(task.name)) {
          // Determine status: passed only if suite passed and all nested tests passed
          const hasFailed =
            task.state === 'fail' ||
            (task.tasks && task.tasks.some((t) => (t.result?.state || t.state) === 'fail'));
          const isPassed =
            !hasFailed &&
            (task.state === 'pass' ||
              (task.tasks &&
                task.tasks.length > 0 &&
                task.tasks.every((t) => (t.result?.state || t.state) === 'pass')));

          let duration = task.result?.duration ?? task.duration;
          if (typeof duration !== 'number' && task.tasks) {
            duration = task.tasks.reduce(
              (sum, t) => sum + (t.result?.duration || t.duration || 0),
              0
            );
          }
          const durationMs = Math.max(1, Math.round(duration || 0));

          bugSuites.push({
            name: task.name,
            status: isPassed ? 'passed' : 'failed',
            duration: `${durationMs}ms`,
            durationNum: durationMs
          });
        } else if (task.tasks) {
          traverseTasks(task.tasks);
        }
      }
    }

    for (const file of files) {
      traverseTasks(file.tasks);
    }

    // Sort deterministically by bug number
    bugSuites.sort((a, b) => {
      const numA = parseInt(a.name.match(/Bug\s+(\d+)/i)?.[1] || '0', 10);
      const numB = parseInt(b.name.match(/Bug\s+(\d+)/i)?.[1] || '0', 10);
      return numA - numB;
    });

    const passedCount = bugSuites.filter((s) => s.status === 'passed').length;
    const failedCount = bugSuites.filter((s) => s.status === 'failed').length;
    const totalDuration = bugSuites.reduce((sum, s) => sum + s.durationNum, 0);

    const output = {};
    for (const suite of bugSuites) {
      output[suite.name] = {
        Status: suite.status,
        "Execution time": suite.duration
      };
    }

    output["Total bugs"] = bugSuites.length;
    output["Passed"] = passedCount;
    output["Failed"] = failedCount;
    output["Total Execution time"] = `${totalDuration}ms`;

    // Strictly output only the JSON block to stdout
    console.log(JSON.stringify(output, null, 2));
  }
}
