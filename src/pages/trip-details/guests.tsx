import { AtSign, CheckCircle2, CircleDashed, UserCog, X } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true)
  }
  function closeModal() {
    setIsModalOpen(false)
  }

  async function inviteParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (participants.some(participant => participant.email === email)) {
      return
    }


    await api.post(`trips/${tripId}/invites`, { email })

    window.document.location.reload();

  }


  useEffect(() => {
    api.get(`trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
              <span className="block text-sm text-zinc-400 truncate">
                {participant.email}
              </span>
            </div>

            {participant.is_confirmed ? (
              <CheckCircle2 className="text-green-400 size-5 shrink-0" />
            ) : (
              <CircleDashed className="text-zinc-400 size-5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Button onClick={openModal} variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>

      {isModalOpen && (
        <ParticipantModal closeModal={closeModal} inviteParticipant={inviteParticipant} />
      )}
    </div>
  )
}

interface ParticipantModalProps {
  closeModal: () => void;
  inviteParticipant: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

function ParticipantModal({
  closeModal,
  inviteParticipant
}: ParticipantModalProps) {

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">Convidar participante</h2>
            <button>
              <X className="size-5 text-zinc-400" onClick={closeModal} />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Convide novos participantes
          </p>
        </div>

        <form onSubmit={inviteParticipant} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <AtSign className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <Button size="full">
            Convidar Participante
          </Button>
        </form>
      </div>
    </div>
  )
}
