export interface NewsletterFile {
      name: string;
      fullName: string;
      size: number;
      creationTime: string;
      lastAccessTime: string;
      lastWriteTime: string;
      isFolder: boolean;
      fileSystemType: string
}

export interface NewsletterFiles {
      docs?:  NewsletterFile[];
      images?: NewsletterFile[];
}
