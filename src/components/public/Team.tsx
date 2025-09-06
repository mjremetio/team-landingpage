'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, Linkedin, Twitter, Mail, ExternalLink, Users } from 'lucide-react'
import { TeamSection, TeamMember } from '@/types'

export function Team() {
  const [content, setContent] = useState<TeamSection | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
    fetchTeamMembers()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/sections')
      const result = await response.json()
      
      if (result.success && result.data.team) {
        setContent(result.data.team.content)
      }
    } catch (error) {
      console.error('Error fetching team content:', error)
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members')
      const result = await response.json()
      
      if (result.success) {
        // Filter to only active members
        const activeMembers = result.data?.filter((member: TeamMember) => member.isActive) || []
        setTeamMembers(activeMembers)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return Github
      case 'linkedin': return Linkedin
      case 'twitter': return Twitter
      case 'email': return Mail
      case 'portfolio': return ExternalLink
      default: return ExternalLink
    }
  }

  const getSocialUrl = (platform: string, value: string) => {
    switch (platform) {
      case 'email': return `mailto:${value}`
      case 'github': return value.startsWith('http') ? value : `https://github.com/${value}`
      case 'linkedin': return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`
      case 'twitter': return value.startsWith('http') ? value : `https://twitter.com/${value}`
      default: return value
    }
  }

  if (loading) {
    return (
      <section id="team" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const displayMembers = content?.displayFeatured 
    ? teamMembers.filter(member => member.specialties.length > 0) 
    : teamMembers

  return (
    <section id="team" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-4xl font-bold">
                {content?.title || 'Our Team'}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {content?.description || 'Meet the talented individuals behind our projects.'}
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMembers.map((member) => (
              <Card key={member.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div className="text-center mb-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                        <span className="text-2xl font-bold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Skills */}
                  {member.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {member.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3 pt-4">
                    {Object.entries(member.socialLinks).map(([platform, value]) => {
                      if (!value) return null
                      const Icon = getSocialIcon(platform)
                      return (
                        <a
                          key={platform}
                          href={getSocialUrl(platform, value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                          title={`${member.name} on ${platform}`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Departments */}
          {content?.departments && content.departments.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">Our Departments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.departments.map((dept, index) => (
                  <Card key={index} className="border-2 border-dashed border-muted-foreground/20">
                    <CardContent className="p-6 text-center">
                      <h4 className="text-lg font-semibold mb-2">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {dept.memberIds?.length || 0} member{(dept.memberIds?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {teamMembers.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground">
                Team members will appear here once they're added to the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}