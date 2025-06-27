"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { useProfile } from "@/context/ProfileProvidor"
import { TimelinePost } from "@/types/timelineposts"
import { Skill } from "@/types/skills"
import { Certification } from "@/types/certificates"
import { Project } from "@/types/projects"
import { Hero } from "@/components/HeroSection"
import { About } from "@/components/AboutSection"
import { TimelineOPT } from "@/components/timeline-optimized"
import { SkillsOpt } from "@/components/newSkills-opt"
import { CertificationsOpt } from "@/components/certificatesNew"
import { ProjectsOpt } from "@/components/ProjectsOpimites"
import { Services } from "@/components/Services"
import { NewContact } from "@/components/contact-form"
import { Footer } from "@/components/Footer"
import { SpaceLoader } from "@/components/Loader"
import IsDevelopment, { IsDevelopmentProps } from "@/components/is-development"

// Centralized fetcher (optional but recommended)
const fetchData = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  return res.json()
}

export default function Home() {
  const { profile, loading: profileLoading } = useProfile()

  // Fetch all data using React Query
  const { data: devStatus, isLoading: devStatusLoading } = useQuery({
    queryKey: ["devStatus"],
    queryFn: () => fetchData<IsDevelopmentProps[]>("/api/development-status").then(res => res[0]),
  })

  const { data: timelineItems, isLoading: timelineLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: () => fetchData<TimelinePost[]>("/api/timelineposts"),
  })

  const { data: skillsData, isLoading: skillsDataLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => fetchData<Skill[]>("/api/skills"),
  })

  const { data: certifications, isLoading: certLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: () => fetchData<Certification[]>("/api/certifications"),
  })

  const { data: projects, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchData<Project[]>("/api/projects"),
  })

  // Combined loading state
  const isLoading = profileLoading || devStatusLoading || timelineLoading || skillsDataLoading || certLoading || projectLoading

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <SpaceLoader key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
          <Hero loading={profileLoading} profile={profile ?? undefined} />
          <IsDevelopment devStatus={devStatus ?? null} loading={devStatusLoading} />
          <About />
          <TimelineOPT timelineItems={timelineItems || []} timelineLoading={timelineLoading} />
          <SkillsOpt skills={skillsData || null} skillloading={skillsDataLoading} />
          <CertificationsOpt certifications={certifications || []} loading={certLoading} />
          <ProjectsOpt projects={projects || []} loading={projectLoading} />
          <Services />
          <NewContact />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}