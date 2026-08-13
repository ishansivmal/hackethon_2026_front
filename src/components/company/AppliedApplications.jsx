import { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { updateApplicationSelection, rankApplicants } from '../../api/company'
import {
  FaGraduationCap,
  FaBriefcase,
  FaMicroscope,
  FaRobot,
  FaFileAlt,
  FaStopwatch,
  FaMoneyBillWave,
  FaLink,
  FaCheck,
  FaHourglassHalf,
  FaMagic,
} from 'react-icons/fa'

const CATEGORIES = [
  { id: 'internship', icon: <FaGraduationCap />, label: 'Applied Internships' },
  { id: 'job', icon: <FaBriefcase />, label: 'Applied Jobs' },
  { id: 'problem', icon: <FaMicroscope />, label: 'Applied Problems' },
]

const AI_ENABLED = ['internship', 'job']

function collectApplications(items, titleKey, type) {
  const rows = []
  items.forEach((item) => {
    ;(item.applications ?? []).forEach((app) => {
      rows.push({
        ...app,
        type,
        postedTitle: item[titleKey],
      })
    })
  })
  return rows
}

function applicationId(row) {
  return row.applied_internship_ID ?? row.applied_job_ID ?? row.applied_problem_ID
}

function scoreKey(row) {
  return `${row.type}-${applicationId(row)}`
}

function recColor(recommendation) {
  if (recommendation === 'Shortlisted') return '#10b981'
  if (recommendation === 'Reject') return '#ef4444'
  return '#d97706'
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function ApplicantCard({ row, icon, onUpdated, aiScore }) {
  const [updating, setUpdating] = useState(false)
  const applicantName = row.user?.name || 'Unknown applicant'

  const handleSelect = async () => {
    const result = await Swal.fire({
      title: 'Select applicant?',
      text: `Mark ${applicantName} as selected for "${row.postedTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, select',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    setUpdating(true)
    try {
      const { data } = await updateApplicationSelection(row.type, applicationId(row), true)
      if (data?.emailSent) {
        toast.success('Applicant selected and notified by email')
      } else {
        toast.warning('Applicant selected, but the notification email could not be sent')
      }
      onUpdated?.()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update application'
      toast.error(message)
    } finally {
      setUpdating(false)
    }
  }

  const showDetail = () => {
    Swal.fire({
      title: escapeHtml(applicantName),
      html: `
        <div style="text-align:left;">
          <p style="font-size:14px;color:#374151;">${escapeHtml(aiScore.summary)}</p>
          <div style="display:inline-block;font-size:24px;font-weight:800;color:#0D47A1;padding:10px 18px;border:2px solid #0D47A1;border-radius:12px;margin:8px 0;">
            ${aiScore.score}/100
          </div>
          <p style="font-weight:700;color:#111827;margin:12px 0 4px;">Strengths</p>
          <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;">
            ${aiScore.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
          </ul>
          <p style="font-weight:700;color:#111827;margin:12px 0 4px;">Weaknesses</p>
          <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;">
            ${aiScore.weaknesses.map((w) => `<li>${escapeHtml(w)}</li>`).join('')}
          </ul>
          <p style="margin-top:12px;">
            <span style="display:inline-block;font-size:13px;font-weight:700;color:${recColor(aiScore.recommendation)};border:1px solid ${recColor(aiScore.recommendation)};border-radius:999px;padding:4px 12px;">
              ${escapeHtml(aiScore.recommendation)}
            </span>
          </p>
        </div>`,
      width: 560,
      confirmButtonText: 'Close',
      confirmButtonColor: '#0D47A1',
    })
  }

  return (
    <article className={`cd-app-card${row.isSelected ? ' cd-app-card--selected' : ''}`}>
      <div className="cd-app-card-head">
        <span className="cd-app-avatar">{applicantName[0]}</span>
        <div className="cd-app-who">
          <h4 className="cd-app-name">{applicantName}</h4>
          {row.user?.email && <p className="cd-app-email">{row.user.email}</p>}
        </div>
        {aiScore && (
          <button
            type="button"
            className="cd-app-ai"
            onClick={showDetail}
            title="View AI fit analysis"
            style={{ '--rec-color': recColor(aiScore.recommendation) }}
          >
            <span><FaRobot /> #{aiScore.rank}</span>
            <strong>{aiScore.score}%</strong>
          </button>
        )}
      </div>
      <p className="cd-app-posted">
        <span>{icon}</span>
        <span>
          Applied to <strong>{row.postedTitle}</strong>
        </span>
      </p>
      {row.cv_url && (
        <a className="cd-app-cv" href={row.cv_url} target="_blank" rel="noreferrer">
          <FaFileAlt /> View CV
        </a>
      )}
      {row.type === 'problem' && row.solution && (
        <div className="cd-app-solution">
          {(row.solution.time || row.solution.budget) && (
            <div className="cd-app-solution-meta">
              {row.solution.time && (
                <span className="cd-app-solution-chip"><FaStopwatch /> {row.solution.time}</span>
              )}
              {row.solution.budget != null && row.solution.budget !== '' && (
                <span className="cd-app-solution-chip"><FaMoneyBillWave /> ${row.solution.budget}</span>
              )}
            </div>
          )}
          {row.solution.solution && (
            <p className="cd-app-solution-text">{row.solution.solution}</p>
          )}
          {row.solution.url && (
            <a className="cd-app-cv" href={row.solution.url} target="_blank" rel="noreferrer">
              <FaLink /> View solution link
            </a>
          )}
          {row.solution.pdf && (
            <a className="cd-app-cv" href={row.solution.pdf} target="_blank" rel="noreferrer">
              <FaFileAlt /> View solution document
            </a>
          )}
        </div>
      )}
      <div className="cd-app-actions">
        <span className={`cd-app-status${row.isSelected ? ' cd-app-status--selected' : ''}`}>
          {row.isSelected ? <><FaCheck /> Selected</> : <><FaHourglassHalf /> Pending</>}
        </span>
        {!row.isSelected && (
          <button
            type="button"
            className="cd-app-toggle"
            onClick={handleSelect}
            disabled={updating}
          >
            {updating ? 'Updating…' : <><FaCheck /> Select</>}
          </button>
        )}
      </div>
    </article>
  )
}

export default function AppliedApplications({ internships = [], jobs = [], problems = [], onUpdated }) {
  const [active, setActive] = useState('internship')
  const [scores, setScores] = useState({})
  const [ranking, setRanking] = useState(false)

  const buckets = {
    internship: collectApplications(internships, 'title', 'internship'),
    job: collectApplications(jobs, 'position', 'job'),
    problem: collectApplications(problems, 'description', 'problem'),
  }

  const current = CATEGORIES.find((c) => c.id === active)
  const rows = buckets[active]
  const supportsAi = AI_ENABLED.includes(active)

  const showRankingSummary = (groups) => {
    const sectionsHtml = groups
      .map((group) => {
        const rowsHtml = group.candidates
          .map((c) => {
            const color = recColor(c.recommendation)
            return `
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(13,71,161,0.15);border-radius:10px;margin-bottom:8px;text-align:left;background:#f8fafc;">
                <div style="min-width:0;">
                  <strong style="color:#0D47A1;">#${c.rank}</strong>
                  <span style="font-weight:700;color:#111827;"> ${escapeHtml(c.name)}</span>
                  <div style="font-size:13px;color:#4b5563;margin-top:2px;">${escapeHtml(c.summary)}</div>
                  <div style="margin-top:6px;">
                    <span style="display:inline-block;font-size:12px;font-weight:600;color:${color};border:1px solid ${color};border-radius:999px;padding:2px 10px;">${escapeHtml(c.recommendation)}</span>
                  </div>
                </div>
                <div style="flex-shrink:0;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#0D47A1;color:#fff;font-weight:700;font-size:16px;">${c.score}%</div>
              </div>
            `
          })
          .join('')

        return `
          <div style="margin-bottom:18px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 8px;">
              <strong style="color:#0D47A1;font-size:15px;">${escapeHtml(group.listingTitle)}</strong>
              <span style="font-size:12px;color:#4b5563;background:#e0e7ff;border-radius:999px;padding:2px 10px;flex-shrink:0;">${group.candidates.length} candidate${group.candidates.length === 1 ? '' : 's'}</span>
            </div>
            ${rowsHtml}
          </div>
        `
      })
      .join('')

    Swal.fire({
      title: 'Best Candidate Suggestions',
      html: `
        <div style="max-height:420px;overflow-y:auto;">${sectionsHtml}</div>
        <p style="font-size:12px;color:#9ca3af;margin:12px 0 0;text-align:left;">
          Candidates are grouped by the ${active} they applied to and ranked best-first within each group.
          Scores are AI-generated from each candidate's CV against that listing's requirements.
          Click any AI badge on a card for the detailed analysis.
        </p>`,
      width: 640,
      confirmButtonText: 'Got it',
      confirmButtonColor: '#0D47A1',
    })
  }

  const handleRank = async () => {
    if (ranking || rows.length === 0) return

    setRanking(true)
    const accumulated = {}
    const scoreMap = {}
    const listingItems = active === 'internship' ? internships : jobs

    for (const item of listingItems) {
      const hasCvApplicants = (item.applications ?? []).some((a) => a.cv_url)
      if (!hasCvApplicants) continue

      const listingId = active === 'internship' ? item.id : item.job_ID
      try {
        const { data } = await rankApplicants(active, listingId)
        const group = accumulated[listingId] ?? {
          listingId,
          listingTitle:
            data.listing?.title || item.title || item.position || 'Untitled listing',
          candidates: [],
        }
        ;(data.candidates ?? []).forEach((c, idx) => {
          group.candidates.push({ ...c, rank: idx + 1 })
          scoreMap[`${active}-${c.id}`] = { ...c, rank: idx + 1 }
        })
        if (group.candidates.length) accumulated[listingId] = group
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to rank applicants'
        toast.warning(msg)
      }
    }

    setScores(scoreMap)
    setRanking(false)

    const groups = Object.values(accumulated)
      .map((g) => ({
        ...g,
        candidates: g.candidates.sort((a, b) => b.score - a.score),
      }))
      .sort(
        (a, b) =>
          (b.candidates[0]?.score ?? 0) - (a.candidates[0]?.score ?? 0)
      )

    if (groups.length) {
      showRankingSummary(groups)
    } else {
      toast.info('No candidates could be ranked. Make sure applicants have uploaded CVs.')
    }
  }

  return (
    <div className="cd-view">
      {supportsAi && (
        <div className="cd-app-toolbar">
          <div className="cd-app-toolbar-info">
            <span className="cd-app-toolbar-icon"><FaRobot /></span>
            <div>
              <h3 className="cd-app-toolbar-title">AI Candidate Suggestions</h3>
              <p className="cd-app-toolbar-sub">
                Analyze each CV against your {active} requirements and rank applicants best-first.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="cd-app-ai-btn"
            onClick={handleRank}
            disabled={ranking || rows.length === 0}
          >
            {ranking ? <><FaHourglassHalf /> Analyzing CVs…</> : <><FaMagic /> Suggest Best Candidates</>}
          </button>
        </div>
      )}

      <div className="cd-cat-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cd-cat-tab${active === cat.id ? ' cd-cat-tab--active' : ''}`}
            onClick={() => setActive(cat.id)}
          >
            <span className="cd-cat-tab-icon">{cat.icon}</span>
            <span className="cd-cat-tab-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {rows.length > 0 ? (
        <div className="cd-app-grid">
          {rows.map((row) => (
            <ApplicantCard
              key={`${applicationId(row)}-${row.user_ID}`}
              row={row}
              icon={current.icon}
              onUpdated={onUpdated}
              aiScore={scores[scoreKey(row)]}
            />
          ))}
        </div>
      ) : (
        <p className="cd-posted-empty">
          No {current.label.toLowerCase()} yet. Applications will appear here when a job seeker
          applies to one of your {active === 'internship' ? 'internship' : active === 'job' ? 'job' : 'problem'} listings.
        </p>
      )}
    </div>
  )
}
