"use client"
import { memo, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useProfile } from "@/context/ProfileProvidor"
import { TimelinePost } from "@/types/timelineposts"
import { Skill } from "@/types/skills"
import { Certification } from "@/types/certificates"
import { Project } from "@/types/projects"
import { About } from "@/components/AboutSection"
import { TimelineOPT } from "@/components/timeline-optimized"
import { SkillsOpt } from "@/components/newSkills-opt"
import { CertificationsOpt } from "@/components/certificatesNew"
import { ProjectsOpt } from "@/components/ProjectsOpimites"
import { Services } from "@/components/Services"
import { NewContact } from "@/components/contact-form"
import { SpaceLoader } from "@/components/Loader"
import HeroSection from "@/components/HeroSection"

// Centralized fetcher with error handling
const fetchData = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.json()
}

// Memoized components for better performance
const MemoizedHeroSection = memo(HeroSection)
const MemoizedAbout = memo(About)
const MemoizedTimeline = memo(TimelineOPT)
const MemoizedSkills = memo(SkillsOpt)
const MemoizedCertifications = memo(CertificationsOpt)
const MemoizedProjects = memo(ProjectsOpt)
const MemoizedServices = memo(Services)
const MemoizedContact = memo(NewContact)

export default function Home() {
  const { loading: profileLoading } = useProfile()

  // Fetch all data using React Query with optimized settings
  const { data: timelineItems, isLoading: timelineLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: () => fetchData<TimelinePost[]>("/api/timelineposts"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const { data: skillsData, isLoading: skillsDataLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => fetchData<Skill[]>("/api/skills"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const { data: certifications, isLoading: certLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: () => fetchData<Certification[]>("/api/certifications"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const { data: projects, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchData<Project[]>("/api/projects"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Memoized loading state
  const isLoading = useMemo(() => 
    profileLoading || timelineLoading || skillsDataLoading || certLoading || projectLoading,
    [profileLoading, timelineLoading, skillsDataLoading, certLoading, projectLoading]
  )

  // Memoized data to prevent unnecessary re-renders
  const memoizedTimelineItems = useMemo(() => timelineItems || [], [timelineItems])
  const memoizedSkillsData = useMemo(() => skillsData || null, [skillsData])
  const memoizedCertifications = useMemo(() => certifications || [], [certifications])
  const memoizedProjects = useMemo(() => projects || [], [projects])

  if (isLoading) {
    return <SpaceLoader />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MemoizedHeroSection />
      <MemoizedAbout />
      <MemoizedTimeline 
        timelineItems={memoizedTimelineItems} 
        timelineLoading={timelineLoading} 
      />
      <MemoizedSkills 
        skills={memoizedSkillsData} 
        skillloading={skillsDataLoading} 
      />
      <MemoizedCertifications 
        certifications={memoizedCertifications} 
        loading={certLoading} 
      />
      <MemoizedProjects 
        projects={memoizedProjects} 
        loading={projectLoading} 
      />
      <MemoizedServices />
      <MemoizedContact />
    </div>
  )
}