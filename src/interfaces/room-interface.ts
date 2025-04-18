export interface Room {
    id: string,
    name: string,
    capacity: number,
    type: 'Workspace' | 'Conference'
}

export interface UpdateRoom {
    name?: string,
    capacity?: number,
    type?: 'Workspace' | 'Conference'
}

export interface CreateRoom extends Omit<Room, "id"> {}
