export interface room {
    id: string,
    name: string,
    capacity: number,
    type: 'Workspace' | 'Conference'
}

export interface updateRoom {
    name?: string,
    capacity?: number,
    type?: 'Workspace' | 'Conference'
}

export interface createRoom extends Omit<room, "id"> {}
