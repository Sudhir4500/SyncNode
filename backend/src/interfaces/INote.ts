/**
 * Note structure definition for the Note App API
 */
export interface INote {
    _id: string;
    userId: string; // Reference to the user who created the note
    title: string;
    content: string;
    tags?: string[]; // Optional array of tags for categorization it helps in searching and filtering notes based on topics or themes.
    isPinned?: boolean; //ux feature to keep important notes at the top of the list
    createdAt: Date;
    updatedAt: Date;
    lastModifiedBy?: string; //Audit trail to track who last modified the note, useful in collaborative environments or for accountability.
    isDeleted?: boolean; //Soft delete flag to mark notes as deleted without actually removing them from the database, allowing for potential recovery or auditing.
    syncStatus?: 'synced' | 'pending' ; //for offline syncing, indicates whether the note has been successfully synced with the server or is still pending synchronization.
}