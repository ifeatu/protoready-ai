import { google } from 'googleapis'

export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  createdTime: string
  modifiedTime: string
  webViewLink?: string
  parents?: string[]
}

export interface GoogleUserProfile {
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
}

export class GoogleService {
  private oauth2Client: any
  private drive: any
  private oauth2: any

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    
    this.oauth2Client.setCredentials({
      access_token: accessToken
    })

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client })
    this.oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
  }

  async getUserProfile(): Promise<GoogleUserProfile> {
    const { data } = await this.oauth2.userinfo.get()
    return data as GoogleUserProfile
  }

  async listDriveFiles(options: {
    pageSize?: number
    pageToken?: string
    q?: string
    orderBy?: string
  } = {}): Promise<{ files: GoogleDriveFile[], nextPageToken?: string }> {
    const {
      pageSize = 10,
      pageToken,
      q = "trashed=false",
      orderBy = 'modifiedTime desc'
    } = options

    const { data } = await this.drive.files.list({
      pageSize,
      pageToken,
      q,
      orderBy,
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, parents)'
    })

    return {
      files: data.files || [],
      nextPageToken: data.nextPageToken
    }
  }

  async getFileContent(fileId: string): Promise<string> {
    const { data } = await this.drive.files.get({
      fileId,
      alt: 'media'
    })
    return data
  }

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
    const { data } = await this.drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, parents'
    })
    return data
  }

  async searchFiles(query: string, options: {
    mimeType?: string
    pageSize?: number
  } = {}): Promise<GoogleDriveFile[]> {
    const { mimeType, pageSize = 10 } = options
    
    let searchQuery = `name contains '${query}' and trashed=false`
    if (mimeType) {
      searchQuery += ` and mimeType='${mimeType}'`
    }

    const { data } = await this.drive.files.list({
      q: searchQuery,
      pageSize,
      orderBy: 'modifiedTime desc',
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, parents)'
    })

    return data.files || []
  }

  async analyzeUserActivity(): Promise<{
    totalFiles: number
    recentFiles: GoogleDriveFile[]
    storageUsed: number
    fileTypes: Record<string, number>
  }> {
    try {
      // Get all files for analysis
      const allFiles: GoogleDriveFile[] = []
      let nextPageToken: string | undefined

      do {
        const { files, nextPageToken: token } = await this.listDriveFiles({
          pageSize: 1000,
          pageToken: nextPageToken
        })
        allFiles.push(...files)
        nextPageToken = token
      } while (nextPageToken)

      // Recent files (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const recentFiles = allFiles.filter(file => 
        new Date(file.modifiedTime) > thirtyDaysAgo
      ).slice(0, 10)

      // Calculate storage used
      const storageUsed = allFiles.reduce((total, file) => 
        total + (file.size ? parseInt(file.size) : 0), 0
      )

      // Analyze file types
      const fileTypes: Record<string, number> = {}
      allFiles.forEach(file => {
        const type = file.mimeType || 'unknown'
        fileTypes[type] = (fileTypes[type] || 0) + 1
      })

      return {
        totalFiles: allFiles.length,
        recentFiles,
        storageUsed,
        fileTypes
      }
    } catch (error) {
      console.error('Error analyzing user activity:', error)
      throw error
    }
  }

  // Helper method to get common MIME types
  static getMimeTypeCategories() {
    return {
      documents: [
        'application/vnd.google-apps.document',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      spreadsheets: [
        'application/vnd.google-apps.spreadsheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      presentations: [
        'application/vnd.google-apps.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ],
      images: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml'
      ],
      folders: [
        'application/vnd.google-apps.folder'
      ]
    }
  }
}

export function createGoogleService(accessToken: string): GoogleService {
  return new GoogleService(accessToken)
}