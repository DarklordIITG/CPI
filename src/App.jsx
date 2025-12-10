import { useEffect, useMemo, useState } from 'react';
import coursesData from './data/courses.json';

const gradePoints = {
  AA: 10,
  AB: 9,
  BB: 8,
  BC: 7,
  CC: 6,
  CD: 5,
  DD: 4,
  FF: 0,
};

const gradeOptions = Object.keys(gradePoints);

export default function App() {
  const branches = useMemo(() => Object.keys(coursesData), []);
  const [branch, setBranch] = useState(branches[0] || '');
  const semesters = useMemo(
    () => (branch ? Object.keys(coursesData[branch] || {}) : []),
    [branch],
  );
  const [semester, setSemester] = useState('');
  const [grades, setGrades] = useState({});
  const [prevSpi, setPrevSpi] = useState('');
  const [prevCredits, setPrevCredits] = useState('');

  useEffect(() => {
    if (semesters.length && !semester) {
      setSemester(semesters[0]);
    } else if (semester && !semesters.includes(semester) && semesters[0]) {
      setSemester(semesters[0]);
    }
    // reset grades when branch/semester changes
    setGrades({});
  }, [branch, semesters, semester]);

  const courses = useMemo(() => {
    if (!branch || !semester) return [];
    return coursesData[branch]?.[semester] || [];
  }, [branch, semester]);

  const totalCredits = useMemo(
    () => courses.reduce((sum, c) => sum + Number(c.credits || 0), 0),
    [courses],
  );

  const spi = useMemo(() => {
    if (!courses.length) return 0;
    const numerator = courses.reduce((sum, c) => {
      const gp = gradePoints[grades[c.code]] ?? 0;
      return sum + gp * Number(c.credits || 0);
    }, 0);
    return totalCredits ? numerator / totalCredits : 0;
  }, [courses, grades, totalCredits]);

  const cpi = useMemo(() => {
    const prevC = Number(prevCredits) || 0;
    const prevS = Number(prevSpi) || 0;
    const currC = totalCredits;
    if (currC === 0 && prevC === 0) return 0;
    const total = prevC + currC;
    return total ? (prevS * prevC + spi * currC) / total : 0;
  }, [prevCredits, prevSpi, spi, totalCredits]);

  const handleGradeChange = (code, value) => {
    setGrades((g) => ({ ...g, [code]: value }));
  };

  const resetAll = () => {
    setGrades({});
    setPrevSpi('');
    setPrevCredits('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            IIT Guwahati SPI & CPI Calculator
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select branch and semester, enter grades, and compute SPI. Optionally include
            previous SPI and credits to see updated CPI. Uses only the local course data.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm lg:col-span-1">
            <div>
              <label className="text-sm font-medium text-slate-700">Branch</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setSemester('');
                }}
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Semester</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {semesters.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-800">Grade Points</h3>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-slate-700">
                {gradeOptions.map((g) => (
                  <div
                    key={g}
                    className="flex items-center justify-between rounded-lg bg-white px-2 py-1 shadow-sm"
                  >
                    <span className="font-semibold">{g}</span>
                    <span className="text-slate-500">{gradePoints[g]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Reset Inputs
            </button>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Courses for {branch} — Semester {semester || '-'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Total Credits: {totalCredits || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Current SPI
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {spi ? spi.toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Course
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Credits
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map((course) => (
                      <tr key={course.code} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {course.code}
                          </div>
                          <div className="text-xs text-slate-600">
                            {course.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {course.credits}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                            value={grades[course.code] || ''}
                            onChange={(e) => handleGradeChange(course.code, e.target.value)}
                          >
                            <option value="">Select</option>
                            {gradeOptions.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!courses.length && (
                      <tr>
                        <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={3}>
                          No courses found for the selected branch/semester.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">CPI Calculator (Optional)</h3>
              <p className="text-sm text-slate-600">
                Enter your cumulative details before this semester to see the updated CPI.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Previous SPI
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={prevSpi}
                    onChange={(e) => setPrevSpi(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g., 8.20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Previous Earned Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={prevCredits}
                    onChange={(e) => setPrevCredits(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g., 90"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Current Semester
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-indigo-600">
                    SPI: {spi ? spi.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-slate-600">Credits: {totalCredits || 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Updated CPI
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-600">
                    {cpi ? cpi.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-slate-600">
                    Total Credits: {(Number(prevCredits) || 0) + totalCredits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}




